import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const { cookieGetMock, cookiesMock, getEnvMock } = vi.hoisted(() => ({
  cookieGetMock: vi.fn(),
  cookiesMock: vi.fn(),
  getEnvMock: vi.fn(),
}));

vi.mock('next/headers', () => ({
  cookies: cookiesMock,
}));

vi.mock('./getenv', () => ({
  getEnv: getEnvMock,
}));

import { apiClient } from './apiClient';

describe('apiClient access-token cookie', () => {
  beforeEach(() => {
    vi.stubEnv('APP_SECRET_KEY', 'application-secret');
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(
        new Response(JSON.stringify({ ok: true }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        })
      )
    );
    getEnvMock.mockReturnValue('https://backend.example.test');
    cookiesMock.mockResolvedValue({ get: cookieGetMock });
    cookieGetMock.mockReset();
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
    cookiesMock.mockReset();
    getEnvMock.mockReset();
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
