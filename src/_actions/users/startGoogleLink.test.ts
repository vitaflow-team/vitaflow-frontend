import { beforeEach, describe, expect, it, vi } from 'vitest';

const { apiClientMock, authMock, signInMock, setIntentCookieMock, calls } =
  vi.hoisted(() => ({
    // Order is part of the contract: the intent is stored before leaving for
    // Google, so each double records its own call here.
    calls: [] as string[],
    apiClientMock: vi.fn(),
    authMock: vi.fn(),
    signInMock: vi.fn(),
    setIntentCookieMock: vi.fn(),
  }));

vi.mock('@/_lib/apiClient', () => ({ apiClient: apiClientMock }));
vi.mock('@/auth', () => ({ auth: authMock, signIn: signInMock }));
vi.mock('@/_lib/googleLinkIntent', () => ({
  setGoogleLinkIntentCookie: setIntentCookieMock,
}));

import { AppError } from '@/_lib/AppError';
import { SAFE_ACTION_FALLBACK } from '@/_lib/safeActionError';
import { actionStartGoogleLink } from './startGoogleLink';

/** A Next `redirect()` is an Error carrying this digest. */
function redirectError(): Error {
  const error = new Error('NEXT_REDIRECT');
  (error as Error & { digest: string }).digest =
    'NEXT_REDIRECT;replace;https://accounts.google.com/o/oauth2/v2/auth;307;';
  return error;
}

describe('unified login account — UT-039 start Google link action', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    calls.length = 0;
    vi.spyOn(console, 'error').mockImplementation(() => {});
    authMock.mockResolvedValue({ user: { id: 'user-1' } });
    apiClientMock.mockImplementation(() => {
      calls.push('link-intent');
      return Promise.resolve({ intent: 'the-intent' });
    });
    setIntentCookieMock.mockImplementation(() => {
      calls.push('cookie');
      return Promise.resolve();
    });
    signInMock.mockImplementation(() => {
      calls.push('google');
      return Promise.resolve();
    });
  });

  it('refuses without a session and asks for nothing', async () => {
    authMock.mockResolvedValue(null);

    const [, error] = await actionStartGoogleLink({});

    expect(error?.code).toBe('NOT_AUTHORIZED');
    expect(apiClientMock).not.toHaveBeenCalled();
    expect(signInMock).not.toHaveBeenCalled();
  });

  it('an ordinary account asks for the intent without a password, stores it, then leaves for Google', async () => {
    const [, error] = await actionStartGoogleLink({});

    expect(error).toBeNull();
    expect(apiClientMock).toHaveBeenCalledWith('/auth/google/link-intent', {
      method: 'POST',
      body: JSON.stringify({}),
    });
    expect(setIntentCookieMock).toHaveBeenCalledWith('the-intent');
    expect(signInMock).toHaveBeenCalledWith('google', {
      redirectTo: '/restrict/settings?tab=conta&aviso=google-conectado',
    });
    expect(calls).toEqual(['link-intent', 'cookie', 'google']);
  });

  it('a staff account sends its password in the body and nothing else', async () => {
    await actionStartGoogleLink({ password: 'SenhaAtual123' });

    expect(apiClientMock.mock.calls[0][1].body).toBe(
      JSON.stringify({ password: 'SenhaAtual123' })
    );
    expect(apiClientMock.mock.calls[0][0]).not.toContain('SenhaAtual123');
  });

  it.each([
    [401, 'invalid_password', 'Senha incorreta. Confira e tente novamente.'],
    [409, 'google_already_linked', 'Esta conta já está conectada ao Google.'],
  ])(
    'maps %i %s to its own message and never reaches Google',
    async (status, code, message) => {
      apiClientMock.mockRejectedValue(
        new AppError('backend copy', status, code)
      );

      const [, error] = await actionStartGoogleLink({ password: 'x' });

      expect(error?.message).toBe(message);
      expect(setIntentCookieMock).not.toHaveBeenCalled();
      expect(signInMock).not.toHaveBeenCalled();
    }
  );

  it('returns the generic message for an unknown failure', async () => {
    apiClientMock.mockRejectedValue(new AppError('internal detail', 500));

    const [, error] = await actionStartGoogleLink({});

    expect(error?.message).toBe(SAFE_ACTION_FALLBACK);
    expect(signInMock).not.toHaveBeenCalled();
  });

  it('lets the redirect to Google through instead of turning it into an error', async () => {
    signInMock.mockRejectedValue(redirectError());

    await expect(actionStartGoogleLink({})).rejects.toThrow('NEXT_REDIRECT');
    expect(setIntentCookieMock).toHaveBeenCalledWith('the-intent');
  });

  it('rejects an empty password before calling the backend', async () => {
    const [, error] = await actionStartGoogleLink({ password: '' });

    expect(error).not.toBeNull();
    expect(apiClientMock).not.toHaveBeenCalled();
  });
});
