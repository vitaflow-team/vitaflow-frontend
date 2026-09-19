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
