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

    expect(limitMock).toHaveBeenCalledWith('203.0.113.10');
    expect(response?.status).toBe(429);
    await expect(response?.text()).resolves.toBe('Too Many Requests');
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

    await expect(
      middleware(request, { params: Promise.resolve({}) })
    ).resolves.toBeUndefined();
  });

  it('IT-004 keeps home and settings open with any or no product type', async () => {
    for (const path of ['/restrict', '/restrict/settings']) {
      for (const productType of ['USER', undefined]) {
        const request = authenticatedRequest(path, productType);
        await expect(
          middleware(request, { params: Promise.resolve({}) })
        ).resolves.toBeUndefined();
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

      await expect(
        middleware(request, { params: Promise.resolve({}) })
      ).resolves.toBeUndefined();
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
