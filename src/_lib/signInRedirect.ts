import { APP_ROUTES } from '@/_constants/routes';
import { redirect } from 'next/navigation';

/** The sign-in address that returns to `callbackPath` afterwards. */
export function signInPathFor(callbackPath: string): string {
  return `${APP_ROUTES.SIGN_IN}?callbackUrl=${encodeURIComponent(callbackPath)}`;
}

/** Sends a session-less visitor to sign in. `redirect` throws: call it outside any `catch`. */
export function redirectToSignIn(callbackPath: string): never {
  redirect(signInPathFor(callbackPath));
}
