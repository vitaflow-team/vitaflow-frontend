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

const VIEW_AS_STATE = {
  token: 'view-as-token',
  sessionId: 'session-1',
  targetLabel: 'Diego Martins',
};

describe('apiClient dual-token handling (platform-admin-access ADR-004, task_05)', () => {
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

  it('uses the view-as token by default when a "ver como" session is active', async () => {
    cookieGetMock.mockImplementation((name: string) => {
      if (name === 'vf_view_as') {
        return { name, value: JSON.stringify(VIEW_AS_STATE) };
      }
      if (name === 'vf_access_token') {
        return { name, value: 'staff-own-token' };
      }
      return undefined;
    });

    await apiClient('/profile');

    const [, init] = vi.mocked(fetch).mock.calls[0];
    expect(new Headers(init?.headers).get('Authorization')).toBe(
      'Bearer view-as-token'
    );
  });

  it("forces the caller's own token when ownToken is set, even during an active session", async () => {
    cookieGetMock.mockImplementation((name: string) => {
      if (name === 'vf_view_as') {
        return { name, value: JSON.stringify(VIEW_AS_STATE) };
      }
      if (name === 'vf_access_token') {
        return { name, value: 'staff-own-token' };
      }
      return undefined;
    });

    await apiClient('/backoffice/accounts', undefined, { ownToken: true });

    const [, init] = vi.mocked(fetch).mock.calls[0];
    expect(new Headers(init?.headers).get('Authorization')).toBe(
      'Bearer staff-own-token'
    );
  });

  it('falls back to the own token when no "ver como" session is active', async () => {
    cookieGetMock.mockImplementation((name: string) => {
      if (name === 'vf_access_token') {
        return { name, value: 'staff-own-token' };
      }
      return undefined;
    });

    await apiClient('/profile');

    const [, init] = vi.mocked(fetch).mock.calls[0];
    expect(new Headers(init?.headers).get('Authorization')).toBe(
      'Bearer staff-own-token'
    );
  });

  it('treats a malformed view-as cookie as absent rather than throwing', async () => {
    cookieGetMock.mockImplementation((name: string) => {
      if (name === 'vf_view_as') {
        return { name, value: 'not-json' };
      }
      if (name === 'vf_access_token') {
        return { name, value: 'staff-own-token' };
      }
      return undefined;
    });

    await expect(apiClient('/profile')).resolves.toEqual({ ok: true });
    const [, init] = vi.mocked(fetch).mock.calls[0];
    expect(new Headers(init?.headers).get('Authorization')).toBe(
      'Bearer staff-own-token'
    );
  });
});
