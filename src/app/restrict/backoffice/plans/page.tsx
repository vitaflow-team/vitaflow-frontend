import { PlansManagementView } from '@/_components/backoffice/plansManagementView';
import { redirectAccessDenied } from '@/_lib/accessDenied';
import { getAdminTierAccess } from '@/_lib/adminTierAuthorization';
import { redirectUnlessBackoffice } from '@/_lib/backofficeAuthorization';
import { isPlansLoadFailure, loadPlansCatalog } from '@/_lib/backofficePlans';

/**
 * Platform product/pricing catalog (ADR-010). Gated by
 * `redirectUnlessBackoffice()`, not `redirectUnlessAdminTier()` — `EQUIPE`
 * must still be able to view the catalog (US-001.AC-1); only mutation is
 * restricted to `ADMIN`, enforced for real by the backend's
 * `AdminTierGuard` regardless of what `canMutate` renders here.
 */
export default async function BackofficePlansPage() {
  await redirectUnlessBackoffice();

  const [adminAccess, catalog] = await Promise.all([
    getAdminTierAccess(),
    loadPlansCatalog(),
  ]);
  if (isPlansLoadFailure(catalog)) {
    redirectAccessDenied();
  }

  const canMutate = adminAccess === 'allowed';

  return (
    <div className="flex flex-col gap-6 py-4">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">
          Catálogo de produtos
        </h1>
        <p className="text-muted-foreground text-sm">
          Preços e tiers vigentes de cada função do Vita Flow.
        </p>
      </div>
      <PlansManagementView catalog={catalog} canMutate={canMutate} />
    </div>
  );
}
