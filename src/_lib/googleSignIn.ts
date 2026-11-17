import 'server-only';

import { env } from './env';

/** Google sign-in exists only when both credentials are configured. */
export function isGoogleSignInEnabled(): boolean {
  return Boolean(env.GOOGLE_CLIENT_ID && env.GOOGLE_CLIENT_SECRET);
}
