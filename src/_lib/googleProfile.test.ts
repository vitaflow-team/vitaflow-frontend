import { AppError } from '@/_lib/AppError';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const { cookieStore, cookiesMock, apiClientMock, setAccessTokenCookieMock } =
  vi.hoisted(() => ({
    cookieStore: new Map<string, string>(),
    cookiesMock: vi.fn(),
    apiClientMock: vi.fn(),
    setAccessTokenCookieMock: vi.fn(),
  }));

vi.mock('server-only', () => ({}));
vi.mock('next/headers', () => ({ cookies: cookiesMock }));
vi.mock('@/_lib/apiClient', () => ({ apiClient: apiClientMock }));
// The real cookie name with a recording setter: what matters here is whether
// a session token was issued, not how the cookie is written.
vi.mock('@/_lib/accessTokenCookie', () => ({
  ACCESS_TOKEN_COOKIE_NAME: 'vf_access_token',
  setAccessTokenCookie: setAccessTokenCookieMock,
}));

import { resolveGoogleUser } from './googleProfile';

const INTENT_COOKIE = 'vf_google_link_intent';
const BACKEND_USER = {
  id: 'user-1',
  name: 'Ana',
  email: 'ana@example.test',
  avatar: null,
  productId: 'free-1',
  accessToken: 'backend-secret',
};

function calledPath(): string {
  return apiClientMock.mock.calls[0][0] as string;
}

function calledBody(): Record<string, unknown> {
  return JSON.parse(apiClientMock.mock.calls[0][1].body as string);
}

describe('unified login account — Google provider profile', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    cookieStore.clear();
    cookiesMock.mockResolvedValue({
      get: (name: string) =>
        cookieStore.has(name) ? { value: cookieStore.get(name) } : undefined,
      set: (name: string, value: string, options: { maxAge?: number }) => {
        if (options.maxAge === 0) cookieStore.delete(name);
        else cookieStore.set(name, value);
      },
    });
    apiClientMock.mockResolvedValue(BACKEND_USER);
  });

  describe('UT-035 sign-in or link', () => {
    it('signs in when there is no link intent', async () => {
      cookieStore.set('vf_access_token', 'current-session');

      const user = await resolveGoogleUser('id-token', 'https://pic/a.png');

      expect(calledPath()).toBe('/auth/google');
      expect(calledBody()).toEqual({ idToken: 'id-token' });
      expect(user).toMatchObject({ id: 'user-1', avatar: 'https://pic/a.png' });
      expect(user).not.toHaveProperty('accessToken');
      expect(user).not.toHaveProperty('refusal');
    });

    it('links when there is an intent and a signed-in account, consuming the intent', async () => {
      cookieStore.set(INTENT_COOKIE, 'the-intent');
      cookieStore.set('vf_access_token', 'current-session');

      await resolveGoogleUser('id-token');

      expect(calledPath()).toBe('/auth/google/link');
      expect(calledBody()).toEqual({
        idToken: 'id-token',
        intent: 'the-intent',
      });
      expect(cookieStore.has(INTENT_COOKIE)).toBe(false);
      expect(setAccessTokenCookieMock).toHaveBeenCalledWith('backend-secret');
    });

    it('signs in, and still discards the intent, when nobody is signed in', async () => {
      cookieStore.set(INTENT_COOKIE, 'stale-intent');

      await resolveGoogleUser('id-token');

      expect(calledPath()).toBe('/auth/google');
      expect(calledBody()).not.toHaveProperty('intent');
      expect(cookieStore.has(INTENT_COOKIE)).toBe(false);
    });

    it('never sends an account identifier', async () => {
      cookieStore.set(INTENT_COOKIE, 'the-intent');
      cookieStore.set('vf_access_token', 'current-session');

      await resolveGoogleUser('id-token');

      expect(Object.keys(calledBody()).sort()).toEqual(['idToken', 'intent']);
    });
  });

  describe('UT-036 refusals', () => {
    it('returns a refusal marker for a staff account and issues no session token', async () => {
      apiClientMock.mockRejectedValue(
        new AppError('backend copy', 403, 'google_link_required')
      );

      const user = await resolveGoogleUser('id-token');

      expect(user).toEqual({
        id: 'refused',
        refusal: 'google_link_required',
        linking: false,
      });
      expect(setAccessTokenCookieMock).not.toHaveBeenCalled();
    });

    it('marks a refused link as linking, so the notice goes to the Conta tab', async () => {
      cookieStore.set(INTENT_COOKIE, 'the-intent');
      cookieStore.set('vf_access_token', 'current-session');
      apiClientMock.mockRejectedValue(
        new AppError('backend copy', 409, 'google_email_mismatch')
      );

      const user = await resolveGoogleUser('id-token');

      expect(user).toMatchObject({
        refusal: 'google_email_mismatch',
        linking: true,
      });
      // The session the person already had is left alone.
      expect(cookieStore.get('vf_access_token')).toBe('current-session');
    });

    it.each([
      ['a failure without a code', new AppError('raw detail', 401)],
      ['an unknown code', new AppError('raw detail', 401, 'something_new')],
      ['a network error', new Error('ECONNREFUSED')],
    ])('throws the generic error for %s', async (_label, failure) => {
      apiClientMock.mockRejectedValue(failure);

      const error = await resolveGoogleUser('id-token').catch(caught => caught);

      expect(error).toBeInstanceOf(AppError);
      expect(error.message).toBe('Falha ao autenticar via Google.');
      expect(error.message).not.toContain('raw detail');
      expect(setAccessTokenCookieMock).not.toHaveBeenCalled();
    });
  });
});
