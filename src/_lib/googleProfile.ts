import 'server-only';

import type { User } from 'next-auth';
import { cookies } from 'next/headers';
import { ACCESS_TOKEN_COOKIE_NAME } from './accessTokenCookie';
import { AppError } from './AppError';
import { linkGoogleIdToken, signInWithGoogleIdToken } from './backendSignIn';
import { consumeGoogleLinkIntentCookie } from './googleLinkIntent';
import { isGoogleRefusalCode } from './googleRefusal';

const GOOGLE_FAILURE = 'Falha ao autenticar via Google.';

/**
 * What the Google provider's `profile()` resolves to (ADR-008, ADR-009).
 *
 * One Google flow serves two purposes. With a link intent *and* a signed-in
 * account, the Google identity is connected to that account; otherwise this
 * is a sign-in. The intent is consumed either way, so it never outlives the
 * attempt it was issued for.
 *
 * A refusal the person can act on comes back as a marker instead of an
 * error: `callbacks.signIn` turns it into a redirect that explains it, and no
 * session is created. Any other failure stays a generic error.
 */
export async function resolveGoogleUser(
  idToken: string,
  picture?: string | null
): Promise<User> {
  const intent = await consumeGoogleLinkIntentCookie();
  const signedIn = Boolean(
    (await cookies()).get(ACCESS_TOKEN_COOKIE_NAME)?.value
  );
  const linking = Boolean(intent && signedIn);

  try {
    const user = linking
      ? await linkGoogleIdToken(idToken, intent!)
      : await signInWithGoogleIdToken(idToken);

    return { ...user, avatar: picture ?? user.avatar ?? undefined } as User;
  } catch (error) {
    const code = error instanceof AppError ? error.code : undefined;
    if (isGoogleRefusalCode(code)) {
      return { id: 'refused', refusal: code, linking } as User;
    }
    throw new AppError(GOOGLE_FAILURE);
  }
}
