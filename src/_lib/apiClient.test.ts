import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const { cookieGetMock, cookiesMock } = vi.hoisted(() => ({
  cookieGetMock: vi.fn(),
  cookiesMock: vi.fn(),
}));

vi.mock('next/headers', () => ({
  cookies: cookiesMock,
}));

vi.mock('./env', () => ({
  env: {
    BACKEND_URL: 'https://backend.example.test',
    APP_SECRET_KEY: 'application-secret',
  },
}));

import { apiClient } from './apiClient';

describe('apiClient access-token cookie', () => {
  beforeEach(() => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(
        new Response(JSON.stringify({ ok: true }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        })
      )
    );
    cookiesMock.mockResolvedValue({ get: cookieGetMock });
    cookieGetMock.mockReset();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    cookiesMock.mockReset();
  });

  it('UT-054 authorizes with vf_access_token when present', async () => {
    cookieGetMock.mockReturnValue({
      name: 'vf_access_token',
      value: 'backend-secret',
    });

    await apiClient('/profile');

    expect(cookieGetMock).toHaveBeenCalledWith('vf_access_token');
    const [, init] = vi.mocked(fetch).mock.calls[0];
    expect(new Headers(init?.headers).get('Authorization')).toBe(
      'Bearer backend-secret'
    );
  });

  it('UT-055 omits Authorization when the cookie is absent', async () => {
    cookieGetMock.mockReturnValue(undefined);

    await apiClient('/profile');

    const [, init] = vi.mocked(fetch).mock.calls[0];
    expect(new Headers(init?.headers).has('Authorization')).toBe(false);
  });

  it('UT-056 treats an expired or browser-cleared cookie as absent', async () => {
    cookieGetMock.mockReturnValue(undefined);

    await expect(apiClient('/profile')).resolves.toEqual({ ok: true });

    const [, init] = vi.mocked(fetch).mock.calls[0];
    expect(new Headers(init?.headers).has('Authorization')).toBe(false);
  });
});
