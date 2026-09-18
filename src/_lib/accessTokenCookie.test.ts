import { beforeEach, describe, expect, it, vi } from 'vitest';

const { cookieSetMock, cookiesMock } = vi.hoisted(() => ({
  cookieSetMock: vi.fn(),
  cookiesMock: vi.fn(),
}));

vi.mock('next/headers', () => ({
  cookies: cookiesMock,
}));

import {
  ACCESS_TOKEN_MAX_AGE_SECONDS,
  clearAccessTokenCookie,
  setAccessTokenCookie,
} from './accessTokenCookie';

describe('vf_access_token cookie', () => {
  beforeEach(() => {
    cookieSetMock.mockReset();
    cookiesMock.mockResolvedValue({ set: cookieSetMock });
  });

  it('sets the backend token with confidential 12-hour cookie options', async () => {
    await setAccessTokenCookie('backend-secret');

    expect(cookieSetMock).toHaveBeenCalledWith(
      'vf_access_token',
      'backend-secret',
      expect.objectContaining({
        httpOnly: true,
        sameSite: 'lax',
        maxAge: ACCESS_TOKEN_MAX_AGE_SECONDS,
        path: '/',
      })
    );
  });

  it('clears the backend token on sign-out using the same cookie path', async () => {
    await clearAccessTokenCookie();

    expect(cookieSetMock).toHaveBeenCalledWith(
      'vf_access_token',
      '',
      expect.objectContaining({ maxAge: 0, path: '/' })
    );
  });
});
