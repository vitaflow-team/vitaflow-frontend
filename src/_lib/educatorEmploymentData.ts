import 'server-only';

import { apiClient } from '@/_lib/apiClient';
import type { SettingsTab } from '@/_lib/settingsTabs';
import type { EducatorEmployment } from '@/_types/educatorEmployment';
import type { SettingsProfile } from '@/_types/settingsProfile';

async function loadList<T>(path: string): Promise<T[]> {
  try {
    return await apiClient<T[]>(path, { method: 'GET', cache: 'no-store' });
  } catch (error) {
    console.error(`Educator employment: failed to load ${path}.`, error);
    return [];
  }
}

export async function loadEducatorEmployments(): Promise<EducatorEmployment[]> {
  return await loadList<EducatorEmployment>('/educators/me/employments');
}

export async function loadEducatorEmploymentTab(
  tab: SettingsTab,
  profile: SettingsProfile | null
): Promise<EducatorEmployment[] | null> {
  if (tab !== 'vinculos' || profile?.productType !== 'PHYSICAL_EDUCATOR') {
    return null;
  }
  return await loadEducatorEmployments();
}
