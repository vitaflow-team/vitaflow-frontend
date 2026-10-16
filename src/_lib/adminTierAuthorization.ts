import 'server-only';

import { redirectAccessDenied } from '@/_lib/accessDenied';
import { isStaffLoadFailure, loadStaffList } from '@/_lib/backofficeStaff';
import type { AdminTierAccess } from '@/_types/adminTierAccess';

/**
 * Admin-tier status lives only on the backend, re-validated live on every
 * request (platform-admin-access, same shape as `backofficeAuthorization.ts`
 * for `isBackoffice`) — asking the staff-list endpoint itself is the check:
 * it 403s for anyone who is not admin interno, including an `EQUIPE`
 * member demoted moments ago (US-010.EC-1).
 */
export async function getAdminTierAccess(): Promise<AdminTierAccess> {
  const staff = await loadStaffList();
  if (!isStaffLoadFailure(staff)) return 'allowed';
  return staff === 'forbidden' ? 'denied' : 'unavailable';
}

/**
 * Page guard for the staff-management and audit-log screens. Fails closed:
 * an unreachable backend is treated like "not admin interno" (US-010).
 */
export async function redirectUnlessAdminTier(): Promise<void> {
  const access = await getAdminTierAccess();
  if (access !== 'allowed') redirectAccessDenied();
}
