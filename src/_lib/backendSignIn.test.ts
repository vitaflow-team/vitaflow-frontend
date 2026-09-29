import { readFileSync } from 'node:fs';
import { AppError } from '@/_lib/AppError';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const { apiClientMock, setAccessTokenCookieMock } = vi.hoisted(() => ({
  apiClientMock: vi.fn(),
  setAccessTokenCookieMock: vi.fn(),
}));

vi.mock('server-only', () => ({}));

vi.mock('@/_lib/apiClient', () => ({
  apiClient: apiClientMock,
}));

vi.mock('@/_lib/accessTokenCookie', () => ({
  setAccessTokenCookie: setAccessTokenCookieMock,
}));

import * as backendSignIn from './backendSignIn';
import {
  signInWithCredentials,
  signInWithGoogleIdToken,
} from './backendSignIn';

const BACKEND_USER = {
  id: 'user-id',
  name: 'Vita User',
  email: 'user@example.com',
  avatar: null,
  productId: null,
  accessToken: 'backend-secret',
};

describe('backendSignIn — sign-in is not a public Server Action', () => {
  it('UT-011 is a server-only module without a use server directive', () => {
    const source = readFileSync(
      new URL('./backendSignIn.ts', import.meta.url),
      'utf8'
    );

    expect(source).not.toMatch(/^\s*['"]use server['"];?\s*$/m);
    expect(source).toMatch(/^import 'server-only';/);
    expect(Object.keys(backendSignIn).sort()).toEqual([
      'signInWithCredentials',
      'signInWithGoogleIdToken',
    ]);
  });
});

describe('signInWithCredentials', () => {
  beforeEach(() => {
    apiClientMock.mockReset();
    setAccessTokenCookieMock.mockReset();
  });

  it('UT-011 stores the password token and returns a token-free user', async () => {
    apiClientMock.mockResolvedValue(BACKEND_USER);

    const result = await signInWithCredentials({
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
    expect(result).toMatchObject({ id: 'user-id', email: 'user@example.com' });
  });

  it('UT-011 wraps backend failures in the same AppError the callback expects', async () => {
    apiClientMock.mockRejectedValue(new AppError('raw backend detail', 401));

    const error = await signInWithCredentials({
      email: 'user@example.com',
      password: 'wrong',
    }).catch(caught => caught);

    expect(error).toBeInstanceOf(AppError);
    expect(error.message).toBe('Falha ao autenticar o usuário.');
    expect(setAccessTokenCookieMock).not.toHaveBeenCalled();
  });
});

describe('signInWithGoogleIdToken', () => {
  beforeEach(() => {
    apiClientMock.mockReset();
    setAccessTokenCookieMock.mockReset();
  });

  it('UT-052 stores the backend token and returns a token-free user', async () => {
    apiClientMock.mockResolvedValue(BACKEND_USER);

    const result = await signInWithGoogleIdToken('google-id-token');

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

    const error = await signInWithGoogleIdToken('invalid-token').catch(
      caught => caught
    );

    expect(error).toBeInstanceOf(AppError);
    expect(error.message).toBe('Falha ao autenticar via Google.');
    expect(error.message).not.toContain('raw backend account detail');
    expect(setAccessTokenCookieMock).not.toHaveBeenCalled();
  });
});
