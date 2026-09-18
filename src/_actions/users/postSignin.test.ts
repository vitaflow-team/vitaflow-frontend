import { AppError } from '@/_lib/AppError';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const { apiClientMock, setAccessTokenCookieMock } = vi.hoisted(() => ({
  apiClientMock: vi.fn(),
  setAccessTokenCookieMock: vi.fn(),
}));

vi.mock('@/_lib/apiClient', () => ({
  apiClient: apiClientMock,
}));

vi.mock('@/_lib/accessTokenCookie', () => ({
  setAccessTokenCookie: setAccessTokenCookieMock,
}));

import { actionSignIn, actionSignInWithGoogle } from './postSignin';

describe('actionSignIn', () => {
  beforeEach(() => {
    apiClientMock.mockReset();
    setAccessTokenCookieMock.mockReset();
  });

  it('stores the password token without returning or submitting a legacy flag', async () => {
    apiClientMock.mockResolvedValue({
      id: 'user-id',
      name: 'Vita User',
      email: 'user@example.com',
      avatar: null,
      productId: null,
      accessToken: 'backend-secret',
    });

    const result = await actionSignIn({
      email: 'user@example.com',
      password: 'password',
    });

    expect(apiClientMock).toHaveBeenCalledWith('/users/signin', {
      method: 'POST',
      body: JSON.stringify({
        email: 'user@example.com',
        password: 'password',
      }),
    });
    expect(setAccessTokenCookieMock).toHaveBeenCalledWith('backend-secret');
    expect(result).not.toHaveProperty('accessToken');
  });
});

describe('actionSignInWithGoogle', () => {
  beforeEach(() => {
    apiClientMock.mockReset();
    setAccessTokenCookieMock.mockReset();
  });

  it('UT-052 stores the backend token and returns a token-free user', async () => {
    apiClientMock.mockResolvedValue({
      id: 'user-id',
      name: 'Vita User',
      email: 'user@example.com',
      avatar: null,
      productId: null,
      accessToken: 'backend-secret',
    });

    const result = await actionSignInWithGoogle('google-id-token');

    expect(apiClientMock).toHaveBeenCalledWith('/auth/google', {
      method: 'POST',
      body: JSON.stringify({ idToken: 'google-id-token' }),
    });
    expect(setAccessTokenCookieMock).toHaveBeenCalledOnce();
    expect(setAccessTokenCookieMock).toHaveBeenCalledWith('backend-secret');
    expect(result).not.toHaveProperty('accessToken');
    expect(result).toMatchObject({ id: 'user-id', email: 'user@example.com' });
  });

  it('UT-053 wraps backend failures without exposing their detail', async () => {
    apiClientMock.mockRejectedValue(
      new AppError('raw backend account detail', 401)
    );

    const error = await actionSignInWithGoogle('invalid-token').catch(
      caught => caught
    );

    expect(error).toBeInstanceOf(AppError);
    expect(error.message).toBe('Falha ao autenticar via Google.');
    expect(error.message).not.toContain('raw backend account detail');
    expect(setAccessTokenCookieMock).not.toHaveBeenCalled();
  });
});
