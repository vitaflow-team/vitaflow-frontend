import 'server-only';

import { cookies } from 'next/headers';

export const GOOGLE_LINK_INTENT_COOKIE_NAME = 'vf_google_link_intent';
/** Same five minutes the backend gives the intent itself. */
export const GOOGLE_LINK_INTENT_MAX_AGE_SECONDS = 5 * 60;

// `lax` so the cookie is still sent when Google redirects the browser back.
const intentCookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  maxAge: GOOGLE_LINK_INTENT_MAX_AGE_SECONDS,
  path: '/',
};

export async function setGoogleLinkIntentCookie(intent: string): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(GOOGLE_LINK_INTENT_COOKIE_NAME, intent, intentCookieOptions);
}

export async function clearGoogleLinkIntentCookie(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(GOOGLE_LINK_INTENT_COOKIE_NAME, '', {
    ...intentCookieOptions,
    maxAge: 0,
  });
}

/** Reads the intent and removes it: it authorizes one attempt, not several. */
export async function consumeGoogleLinkIntentCookie(): Promise<string | null> {
  const cookieStore = await cookies();
  const intent = cookieStore.get(GOOGLE_LINK_INTENT_COOKIE_NAME)?.value;
  if (!intent) return null;

  await clearGoogleLinkIntentCookie();
  return intent;
}
