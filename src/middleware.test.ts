import { unstable_doesMiddlewareMatch } from 'next/experimental/testing/server';
import { NextRequest } from 'next/server';
import { afterEach, describe, expect, it, vi } from 'vitest';

const { limitMock } = vi.hoisted(() => ({
  limitMock: vi.fn(),
}));

vi.mock('@/auth', () => ({
  auth: (handler: (request: NextRequest) => Promise<Response | undefined>) =>
    handler,
}));

vi.mock('@/_lib/ratelimit', () => ({
  ratelimit: {
    limit: limitMock,
  },
}));

import middleware, { config } from './middleware';

/** The middleware let the request through to the page (with its CSP). */
function expectPassThrough(response: Response | void | undefined) {
  expect(response?.status).toBe(200);
  expect(response?.headers.get('x-middleware-next')).toBe('1');
}

function matches(path: string): boolean {
  return unstable_doesMiddlewareMatch({
    config,
    nextConfig: {},
    url: `https://vitaflow.test${path}`,
  });
}

describe('middleware matcher', () => {
  it('UT-048 matches /signin', () => {
    expect(matches('/signin')).toBe(true);
  });

  it('UT-049 matches /signup', () => {
    expect(matches('/signup')).toBe(true);
  });

  it('UT-050 matches the Google OAuth callback', () => {
    expect(matches('/api/auth/callback/google')).toBe(true);
  });

  it('UT-051 keeps private routes covered', () => {
    expect(matches('/restrict/dashboard')).toBe(true);
  });
});

describe('middleware rate limiting', () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    limitMock.mockReset();
  });

  it('IT-017 returns 429 for an exhausted /signin request', async () => {
    vi.stubEnv('KV_REST_API_URL', 'https://kv.example.test');
    vi.stubEnv('KV_REST_API_TOKEN', 'test-token');
    limitMock.mockResolvedValue({ success: false });

    const request = new NextRequest('https://vitaflow.test/signin', {
      headers: { 'x-forwarded-for': '203.0.113.10' },
    });
    const response = await middleware(request, { params: Promise.resolve({}) });

    expect(limitMock).toHaveBeenCalledWith('203.0.113.10:/signin');
    expect(response?.status).toBe(429);
    await expect(response?.text()).resolves.toBe('Too Many Requests');
  });
});

describe('auth input hardening — middleware rate limiter integrity', () => {
  function signinRequest(path = '/signin') {
    return new NextRequest(`https://vitaflow.test${path}`, {
      headers: {
        'true-client-ip': '198.51.100.7',
        'x-forwarded-for': '203.0.113.66, 172.71.195.123',
      },
    });
  }

  function withKvConfigured(nodeEnv: string) {
    vi.stubEnv('KV_REST_API_URL', 'https://kv.example.test');
    vi.stubEnv('KV_REST_API_TOKEN', 'test-token');
    vi.stubEnv('NODE_ENV', nodeEnv);
  }

  afterEach(() => {
    vi.unstubAllEnvs();
    vi.restoreAllMocks();
    limitMock.mockReset();
  });

  it('matches the activation page', () => {
    expect(matches('/signin/activate')).toBe(true);
  });

  it('rate limits the activation page on its own bucket', async () => {
    withKvConfigured('production');
    vi.stubEnv('RENDER', 'true');
    limitMock.mockResolvedValue({ success: true });

    await middleware(signinRequest('/signin/activate'), {
      params: Promise.resolve({}),
    });

    expect(limitMock).toHaveBeenCalledWith('198.51.100.7:/signin/activate');
  });

  it('keys on the platform client IP on Render, not on X-Forwarded-For', async () => {
    withKvConfigured('production');
    vi.stubEnv('RENDER', 'true');
    limitMock.mockResolvedValue({ success: true });

    await middleware(signinRequest(), { params: Promise.resolve({}) });

    expect(limitMock).toHaveBeenCalledWith('198.51.100.7:/signin');
  });

  it('blocks the request in production when the store call fails', async () => {
    withKvConfigured('production');
    const log = vi.spyOn(console, 'error').mockImplementation(() => {});
    limitMock.mockRejectedValue(new Error('ECONNREFUSED'));

    const response = await middleware(signinRequest(), {
      params: Promise.resolve({}),
    });

    expect(response?.status).toBe(429);
    expect(log).toHaveBeenCalledTimes(1);
    expect(JSON.stringify(log.mock.calls)).not.toContain('198.51.100.7');
  });

  it('blocks the request in production when the store times out', async () => {
    withKvConfigured('production');
    vi.spyOn(console, 'error').mockImplementation(() => {});
    limitMock.mockResolvedValue({ success: true, reason: 'timeout' });

    const response = await middleware(signinRequest(), {
      params: Promise.resolve({}),
    });

    expect(response?.status).toBe(429);
  });

  it('only warns outside production when the store call fails', async () => {
    withKvConfigured('development');
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    limitMock.mockRejectedValue(new Error('ECONNREFUSED'));

    const response = await middleware(signinRequest(), {
      params: Promise.resolve({}),
    });

    expectPassThrough(response);
    expect(warn).toHaveBeenCalledTimes(1);
  });

  it('keeps the no-op fallback when the KV variables are absent', async () => {
    vi.stubEnv('NODE_ENV', 'production');
    vi.stubEnv('KV_REST_API_URL', '');
    vi.stubEnv('KV_REST_API_TOKEN', '');

    const response = await middleware(signinRequest(), {
      params: Promise.resolve({}),
    });

    expectPassThrough(response);
    expect(limitMock).not.toHaveBeenCalled();
  });
});

function authenticatedRequest(
  path: string,
  productType?: string,
  headers?: HeadersInit
) {
  const request = new NextRequest(`https://vitaflow.test${path}`, { headers });
  return Object.assign(request, { auth: { user: { productType } } });
}

describe('middleware restricted route access', () => {
  it('IT-001 redirects a blocked user to an allowed same-origin referer with a notice', async () => {
    const request = authenticatedRequest('/restrict/clients', 'USER', {
      referer: 'https://vitaflow.test/restrict/progress',
    });
    const response = await middleware(request, { params: Promise.resolve({}) });

    expect(response?.status).toBe(307);
    expect(response?.headers.get('location')).toBe(
      'https://vitaflow.test/restrict/progress?aviso=sem-permissao'
    );
  });

  it('IT-002 redirects a blocked nested route to restricted home', async () => {
    const request = authenticatedRequest('/restrict/clients/123', 'USER');
    const response = await middleware(request, { params: Promise.resolve({}) });

    expect(response?.status).toBe(307);
    expect(response?.headers.get('location')).toBe(
      'https://vitaflow.test/restrict?aviso=sem-permissao'
    );
  });

  it('IT-003 allows a professional on a nested client route', async () => {
    const request = authenticatedRequest(
      '/restrict/clients/123',
      'NUTRITIONIST'
    );

    expectPassThrough(
      await middleware(request, { params: Promise.resolve({}) })
    );
  });

  it('IT-004 keeps home and settings open with any or no product type', async () => {
    for (const path of ['/restrict', '/restrict/settings']) {
      for (const productType of ['USER', undefined]) {
        const request = authenticatedRequest(path, productType);
        expectPassThrough(
          await middleware(request, { params: Promise.resolve({}) })
        );
      }
    }
  });

  it('IT-005 preserves the signed-out rewrite without a permission notice', async () => {
    const request = new NextRequest('https://vitaflow.test/restrict/clients');
    const response = await middleware(request, { params: Promise.resolve({}) });

    expect(response?.headers.get('x-middleware-rewrite')).toBeTruthy();
    expect(response?.headers.get('location')).toBeNull();
    expect([...response!.headers.values()].join(' ')).not.toContain('aviso');
  });

  it('IT-006 rejects an external referer and stays on the request origin', async () => {
    const request = authenticatedRequest('/restrict/clients', 'USER', {
      referer: 'https://evil.example/x',
    });
    const response = await middleware(request, { params: Promise.resolve({}) });
    const location = new URL(response!.headers.get('location')!);

    expect(response?.status).toBe(307);
    expect(location.origin).toBe('https://vitaflow.test');
  });
});

describe('professional personal use — middleware access', () => {
  it('IT-007 lets a professional open Minha evolução and blocks a USER on Pessoas', async () => {
    for (const productType of ['NUTRITIONIST', 'PHYSICAL_EDUCATOR']) {
      const request = authenticatedRequest('/restrict/progress', productType);

      expectPassThrough(
        await middleware(request, { params: Promise.resolve({}) })
      );
    }

    const blocked = authenticatedRequest('/restrict/clients', 'USER');
    const response = await middleware(blocked, {
      params: Promise.resolve({}),
    });

    expect(response?.status).toBe(307);
    expect(response?.headers.get('location')).toBe(
      'https://vitaflow.test/restrict?aviso=sem-permissao'
    );
  });
});

describe('platform hardening — CSP nonce', () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  function scriptSource(policy: string | null | undefined): string {
    return policy?.split('; ').find(d => d.startsWith('script-src')) ?? '';
  }

  it('M-003 authorizes scripts by a per-request nonce in production', async () => {
    vi.stubEnv('NODE_ENV', 'production');

    const response = await middleware(
      new NextRequest('https://vitaflow.test/'),
      {
        params: Promise.resolve({}),
      }
    );
    const policy = response?.headers.get('content-security-policy');

    expect(scriptSource(policy)).toMatch(
      /^script-src 'self' 'nonce-[A-Za-z0-9+/=]+' https:\/\/js\.stripe\.com$/
    );
    expect(scriptSource(policy)).not.toContain('unsafe-inline');
    expect(scriptSource(policy)).not.toContain('unsafe-eval');
  });

  it('M-003 forwards the same policy to Next so it can stamp the nonce', async () => {
    vi.stubEnv('NODE_ENV', 'production');

    const response = await middleware(
      new NextRequest('https://vitaflow.test/signin'),
      { params: Promise.resolve({}) }
    );

    expect(
      response?.headers.get('x-middleware-request-content-security-policy')
    ).toBe(response?.headers.get('content-security-policy'));
    expect(response?.headers.get('x-middleware-request-x-nonce')).toBeTruthy();
  });

  it('M-003 issues a fresh nonce for every request', async () => {
    vi.stubEnv('NODE_ENV', 'production');
    const policyFor = async () =>
      (
        await middleware(new NextRequest('https://vitaflow.test/'), {
          params: Promise.resolve({}),
        })
      )?.headers.get('content-security-policy');

    expect(await policyFor()).not.toBe(await policyFor());
  });

  it('M-003 keeps the permissive development policy unchanged', async () => {
    vi.stubEnv('NODE_ENV', 'development');

    const response = await middleware(
      new NextRequest('https://vitaflow.test/'),
      {
        params: Promise.resolve({}),
      }
    );

    expect(scriptSource(response?.headers.get('content-security-policy'))).toBe(
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://js.stripe.com"
    );
  });

  it('M-003 sends the policy with the signed-out rewrite', async () => {
    vi.stubEnv('NODE_ENV', 'production');

    const response = await middleware(
      new NextRequest('https://vitaflow.test/restrict/clients'),
      { params: Promise.resolve({}) }
    );

    expect(response?.headers.get('x-middleware-rewrite')).toBeTruthy();
    expect(
      scriptSource(response?.headers.get('content-security-policy'))
    ).toContain("'nonce-");
  });

  it('M-003 runs on every page and skips static assets', () => {
    for (const path of ['/', '/functions', '/privacy', '/api/stripe/webhook']) {
      expect(matches(path)).toBe(true);
    }
    for (const path of ['/_next/static/chunks/main.js', '/vitaflow.svg']) {
      expect(matches(path)).toBe(false);
    }
  });
});
