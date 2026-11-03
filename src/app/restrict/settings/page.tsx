import { actionGetPlans, type Product } from '@/_actions/products/getPlans';
import DefaultLayout from '@/_components/layout/defaultLayout';
import { PlanSessionSync } from '@/_components/settings/planSessionSync';
import { SettingsBreadcrumb } from '@/_components/settings/settingsBreadcrumb';
import { SettingsTabs } from '@/_components/settings/settingsTabs';
import { UnsavedChangesProvider } from '@/_components/settings/unsavedChangesProvider';
import { Title } from '@/_components/ui/title';
import { PAGE_TITLES } from '@/_constants/pageTitles';
import { redirectIfReceptionist } from '@/_lib/academiaAuthorization';
import { loadAcademiaDataForTab } from '@/_lib/academiaSettingsData';
import { apiClient } from '@/_lib/apiClient';
import { loadBillingAccountForTab } from '@/_lib/billingData';
import { loadEducatorEmploymentTab } from '@/_lib/educatorEmploymentData';
import { isLoadFailure, loadPreferences } from '@/_lib/notificationsData';
import {
  isSettingsPlanStale,
  parseCheckoutStatus,
} from '@/_lib/settingsProfile';
import {
  parseSettingsTab,
  settingsPanelId,
  settingsTabId,
  type SettingsTab,
} from '@/_lib/settingsTabs';
import type { SettingsProfile } from '@/_types/settingsProfile';
import { auth } from '@/auth';
import type { Metadata } from 'next';
import { SettingsPanel } from './settingsPanel';

export const metadata: Metadata = {
  title: PAGE_TITLES.settings,
};

interface SettingsProps {
  searchParams: Promise<{
    tab?: string | string[];
    checkout?: string | string[];
  }>;
}

async function loadProfile(): Promise<SettingsProfile | null> {
  try {
    return await apiClient<SettingsProfile>('/profile', { method: 'GET' });
  } catch (error) {
    console.error('Failed to load profile:', error);
    return null;
  }
}

/**
 * The whole catalog in a single call; switching category filters this list in
 * memory without going back to the network (ADR-003). A failure must be told
 * apart from an empty catalog: only it swaps the panel for an error message
 * (US-006.EC-3).
 */
async function loadPlans(
  tab: SettingsTab
): Promise<{ plans: Product[]; plansFailed: boolean }> {
  if (tab !== 'plano') return { plans: [], plansFailed: false };

  const [catalog, plansError] = await actionGetPlans();
  return { plans: catalog ?? [], plansFailed: Boolean(plansError) };
}

async function loadTabData(tab: SettingsTab, profile: SettingsProfile | null) {
  const { plans, plansFailed } = await loadPlans(tab);
  const academiaData = await loadAcademiaDataForTab(tab, profile);
  const educatorEmployments = await loadEducatorEmploymentTab(tab, profile);
  const billingAccount = await loadBillingAccountForTab(tab, profile);
  const prefsResult = tab === 'notificacoes' ? await loadPreferences() : null;
  const preferences =
    prefsResult && !isLoadFailure(prefsResult) ? prefsResult : null;
  return {
    plans,
    plansFailed,
    academiaData,
    educatorEmployments,
    billingAccount,
    preferences,
  };
}

export default async function Settings({ searchParams }: SettingsProps) {
  const session = await auth();
  if (!session) return null;
  await redirectIfReceptionist();

  const { tab: tabParam, checkout: checkoutParam } = await searchParams;
  const tab = parseSettingsTab(tabParam);
  const justCheckedOut = parseCheckoutStatus(checkoutParam);

  const profile = await loadProfile();
  const tabData = await loadTabData(tab, profile);
  const planStale = isSettingsPlanStale({
    sessionProductId: session.user?.productId,
    profile,
    justCheckedOut,
  });

  return (
    <DefaultLayout>
      <PlanSessionSync stale={planStale} />
      <SettingsBreadcrumb tab={tab} />
      <Title label={PAGE_TITLES.settings} className="text-left" />
      <SettingsTabs selected={tab} productType={session.user?.productType} />
      <UnsavedChangesProvider>
        <div
          role="tabpanel"
          id={settingsPanelId(tab)}
          aria-labelledby={settingsTabId(tab)}
          tabIndex={0}
          className="flex flex-col gap-2 pt-4 focus-visible:outline-hidden"
        >
          <SettingsPanel tab={tab} profile={profile} {...tabData} />
        </div>
      </UnsavedChangesProvider>
    </DefaultLayout>
  );
}
