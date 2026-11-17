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
  linkGoogleIdToken,
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
      'linkGoogleIdToken',
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

function rejectionOf(promise: Promise<unknown>): Promise<AppError> {
  return promise.then(
    () => {
      throw new Error('Expected the call to be rejected.');
    },
    (caught: unknown) => caught as AppError
  );
}

describe('unified login account — UT-034 Google failures keep their code', () => {
  beforeEach(() => {
    apiClientMock.mockReset();
    setAccessTokenCookieMock.mockReset();
  });

  it.each([
    ['signInWithGoogleIdToken', signInWithGoogleIdToken, '/auth/google'],
    ['linkGoogleIdToken', linkGoogleIdToken, '/auth/google/link'],
  ] as const)(
    '%s rethrows the backend code with a generic message',
    async (_name, call, path) => {
      apiClientMock.mockRejectedValue(
        new AppError('backend copy', 403, 'google_link_required')
      );

      const error = await rejectionOf(call('id-token', 'the-intent'));

      expect(apiClientMock.mock.calls[0][0]).toBe(path);
      expect(error).toBeInstanceOf(AppError);
      expect(error.code).toBe('google_link_required');
      expect(error.statusCode).toBe(403);
      expect(error.message).toBe('Falha ao autenticar via Google.');
      expect(setAccessTokenCookieMock).not.toHaveBeenCalled();
    }
  );

  it.each([
    ['a failure without a code', new AppError('raw detail', 401)],
    ['a network error', new Error('ECONNREFUSED')],
  ])(
    'turns %s into the generic error with no code',
    async (_label, failure) => {
      apiClientMock.mockRejectedValue(failure);

      const error = await rejectionOf(
        linkGoogleIdToken('id-token', 'the-intent')
      );

      expect(error.code).toBeUndefined();
      expect(error.message).toBe('Falha ao autenticar via Google.');
    }
  );

  it('the link call sends the token and the intent, stores the new token and drops it from the user', async () => {
    apiClientMock.mockResolvedValue(BACKEND_USER);

    const user = await linkGoogleIdToken('id-token', 'the-intent');

    expect(apiClientMock).toHaveBeenCalledWith('/auth/google/link', {
      method: 'POST',
      body: JSON.stringify({ idToken: 'id-token', intent: 'the-intent' }),
    });
    expect(setAccessTokenCookieMock).toHaveBeenCalledWith('backend-secret');
    expect(user).not.toHaveProperty('accessToken');
  });
});
