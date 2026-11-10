import 'server-only';

import { listServicePackages } from '@/_actions/service-packages/listServicePackages';
import type { SettingsTab } from '@/_lib/settingsTabs';
import type { ServicePackage } from '@/_types/servicePackages';
import type { SettingsProfile } from '@/_types/settingsProfile';

const PACOTES_TYPES = new Set(['NUTRITIONIST', 'PHYSICAL_EDUCATOR']);

/**
 * The caller's own private package catalog (ADR-006) — only fetched for the
 * owning professional on the `pacotes` tab. A load failure is swallowed to
 * an empty catalog (logged), mirroring `academiaSettingsData.ts`'s own
 * `loadList` precedent: unlike the public `plano` catalog (US-006.EC-3),
 * there is no assigned requirement here to tell a failure apart from an
 * empty catalog.
 */
export async function loadServicePackagesForTab(
  tab: SettingsTab,
  profile: SettingsProfile | null
): Promise<ServicePackage[]> {
  if (tab !== 'pacotes' || !PACOTES_TYPES.has(profile?.productType ?? '')) {
    return [];
  }

  const [packages, error] = await listServicePackages();
  if (error) {
    console.error('Failed to load service packages:', error);
  }
  return packages ?? [];
}
