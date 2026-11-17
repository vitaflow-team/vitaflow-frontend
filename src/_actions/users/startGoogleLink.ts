'use server';

import { apiClient } from '@/_lib/apiClient';
import { setGoogleLinkIntentCookie } from '@/_lib/googleLinkIntent';
import { googleLinkedRedirect } from '@/_lib/googleRefusal';
import { toSafeActionError, TOO_MANY_REQUESTS } from '@/_lib/safeActionError';
import { startGoogleLinkSchema } from '@/_schema/startGoogleLink';
import type { ErrorMapping } from '@/_types/errorMapping';
import { auth, signIn } from '@/auth';
import { createServerAction, ZSAError } from 'zsa';

const KNOWN_ERRORS: ErrorMapping[] = [
  {
    status: 401,
    code: 'invalid_password',
    message: 'Senha incorreta. Confira e tente novamente.',
  },
  {
    status: 409,
    code: 'google_already_linked',
    message: 'Esta conta já está conectada ao Google.',
  },
  TOO_MANY_REQUESTS,
];

async function requestLinkIntent(password?: string): Promise<string> {
  try {
    const { intent } = await apiClient<{ intent: string }>(
      '/auth/google/link-intent',
      { method: 'POST', body: JSON.stringify(password ? { password } : {}) }
    );
    return intent;
  } catch (error) {
    throw toSafeActionError('startGoogleLink', error, KNOWN_ERRORS);
  }
}

/**
 * Starts "Conectar Google" for the signed-in account (US-005). The backend
 * issues a five-minute intent — after checking the password, for an account
 * with staff access — which waits in an httpOnly cookie while the person is
 * at Google. Acts on the signed-in account only: no identifier is sent.
 */
export const actionStartGoogleLink = createServerAction()
  .input(startGoogleLinkSchema)
  .handler(async ({ input }) => {
    const session = await auth();
    if (!session?.user?.id) {
      throw new ZSAError('NOT_AUTHORIZED', 'Usuário não autenticado.');
    }

    await setGoogleLinkIntentCookie(await requestLinkIntent(input.password));

    // Outside any `try` on purpose: this leaves for Google by throwing
    // `NEXT_REDIRECT`, which a `catch` would turn into a generic error.
    await signIn('google', { redirectTo: googleLinkedRedirect() });
  });
