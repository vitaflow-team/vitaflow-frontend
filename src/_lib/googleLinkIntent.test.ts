import { beforeEach, describe, expect, it, vi } from 'vitest';

const { cookieGetMock, cookieSetMock, cookiesMock } = vi.hoisted(() => ({
  cookieGetMock: vi.fn(),
  cookieSetMock: vi.fn(),
  cookiesMock: vi.fn(),
}));

vi.mock('server-only', () => ({}));
vi.mock('next/headers', () => ({ cookies: cookiesMock }));

import {
  clearGoogleLinkIntentCookie,
  consumeGoogleLinkIntentCookie,
  GOOGLE_LINK_INTENT_MAX_AGE_SECONDS,
  setGoogleLinkIntentCookie,
} from './googleLinkIntent';

describe('unified login account — UT-040 Google link intent cookie', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    cookiesMock.mockResolvedValue({ get: cookieGetMock, set: cookieSetMock });
  });

  it('stores the intent in an httpOnly, lax, five-minute cookie', async () => {
    await setGoogleLinkIntentCookie('the-intent');

    expect(GOOGLE_LINK_INTENT_MAX_AGE_SECONDS).toBe(300);
    expect(cookieSetMock).toHaveBeenCalledWith(
      'vf_google_link_intent',
      'the-intent',
      expect.objectContaining({
        httpOnly: true,
        sameSite: 'lax',
        maxAge: 300,
        path: '/',
      })
    );
  });

  it('consuming returns the intent and deletes the cookie', async () => {
    cookieGetMock.mockReturnValue({ value: 'the-intent' });

    await expect(consumeGoogleLinkIntentCookie()).resolves.toBe('the-intent');

    expect(cookieGetMock).toHaveBeenCalledWith('vf_google_link_intent');
    expect(cookieSetMock).toHaveBeenCalledWith(
      'vf_google_link_intent',
      '',
      expect.objectContaining({ maxAge: 0, path: '/' })
    );
  });

  it.each([undefined, { value: '' }])(
    'consuming returns null and writes nothing when the cookie is %o',
    stored => {
      cookieGetMock.mockReturnValue(stored);

      return expect(consumeGoogleLinkIntentCookie())
        .resolves.toBeNull()
        .then(() => expect(cookieSetMock).not.toHaveBeenCalled());
    }
  );

  it('clearing expires the cookie on the same path', async () => {
    await clearGoogleLinkIntentCookie();

    expect(cookieSetMock).toHaveBeenCalledWith(
      'vf_google_link_intent',
      '',
      expect.objectContaining({ maxAge: 0, path: '/', httpOnly: true })
    );
  });
});
