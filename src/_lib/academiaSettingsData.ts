import 'server-only';

import { apiClient } from '@/_lib/apiClient';
import type { SettingsTab } from '@/_lib/settingsTabs';
import type {
  AcademiaAccessPlan,
  AcademiaEmployment,
  AcademiaInvitation,
  AcademiaStaffMember,
  AcademiaStudent,
} from '@/_types/academia';
import type { SettingsProfile } from '@/_types/settingsProfile';

export interface AcademiaSettingsData {
  invitations: AcademiaInvitation[];
  employments: AcademiaEmployment[];
  staff: AcademiaStaffMember[];
  accessPlans: AcademiaAccessPlan[];
  students: AcademiaStudent[];
}

async function loadList<T>(path: string): Promise<T[]> {
  try {
    return await apiClient<T[]>(path, { method: 'GET', cache: 'no-store' });
  } catch (error) {
    console.error(`Academia settings: failed to load ${path}.`, error);
    return [];
  }
}

async function loadAcademiaSettingsData(): Promise<AcademiaSettingsData> {
  const [invitations, employments, staff, accessPlans, students] =
    await Promise.all([
      loadList<AcademiaInvitation>('/academia/invitations'),
      loadList<AcademiaEmployment>('/academia/educators'),
      loadList<AcademiaStaffMember>('/academia/staff'),
      loadList<AcademiaAccessPlan>('/academia/access-plans'),
      loadList<AcademiaStudent>('/academia/students'),
    ]);

  return { invitations, employments, staff, accessPlans, students };
}

export async function loadAcademiaDataForTab(
  tab: SettingsTab,
  profile: SettingsProfile | null
): Promise<AcademiaSettingsData | null> {
  if (tab !== 'academia' || profile?.productType !== 'ACADEMIA') return null;
  return await loadAcademiaSettingsData();
}
