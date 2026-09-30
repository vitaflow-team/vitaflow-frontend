import 'server-only';

import { redirectAccessDenied } from '@/_lib/accessDenied';
import { isLoadFailure, loadPendingQueue } from '@/_lib/exerciseCatalog';
import type { BackofficeAccess } from '@/_types/backofficeAccess';

/**
 * Staff status lives only on the backend (`Users.isBackoffice`), outside the
 * session, so it is asked there: the moderation queue answers 403 to anyone
 * who is not staff.
 */
export async function getBackofficeAccess(): Promise<BackofficeAccess> {
  const queue = await loadPendingQueue();
  if (!isLoadFailure(queue)) return 'allowed';
  return queue === 'forbidden' ? 'denied' : 'unavailable';
}

/**
 * Page guard for every backoffice screen. It fails closed: when the backend
 * cannot confirm staff status, the caller is sent back like any non-staff
 * user.
 */
export async function redirectUnlessBackoffice(): Promise<void> {
  const access = await getBackofficeAccess();
  if (access !== 'allowed') redirectAccessDenied();
}
