import { StaffManagementView } from '@/_components/backoffice/staffManagementView';
import { redirectAccessDenied } from '@/_lib/accessDenied';
import { redirectUnlessAdminTier } from '@/_lib/adminTierAuthorization';
import { isStaffLoadFailure, loadStaffList } from '@/_lib/backofficeStaff';

/** Admin-interno-only staff management (US-007 through US-010). */
export default async function BackofficeStaffPage() {
  await redirectUnlessAdminTier();

  const staff = await loadStaffList();
  if (isStaffLoadFailure(staff)) {
    redirectAccessDenied();
  }

  return (
    <div className="flex flex-col gap-6 py-4">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">
          Equipe Vita Flow
        </h1>
        <p className="text-muted-foreground text-sm">
          Convide, promova, rebaixe ou remova o acesso de colegas internos.
        </p>
      </div>
      <StaffManagementView staff={staff} />
    </div>
  );
}
