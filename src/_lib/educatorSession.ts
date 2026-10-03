import 'server-only';

import { assertEducator } from '@/_lib/studentsAuthorization';
import { auth } from '@/auth';
import { ZSAError } from 'zsa';

/**
 * The first step of every educator action: a signed-in session, and a fresh
 * check (from the backend profile, not the session JWT) that the caller is a
 * physical educator.
 */
export async function requireEducatorSession(): Promise<void> {
  const session = await auth();
  if (!session?.user) {
    throw new ZSAError('NOT_AUTHORIZED', 'Usuário não autenticado');
  }

  await assertEducator();
}
