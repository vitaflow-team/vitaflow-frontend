import { actionGetPlans, type Product } from '@/_actions/products/getPlans';
import { actionUpdateSubscription } from '@/_actions/users/postUpdateSubscription';
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
import { loadEducatorEmploymentTab } from '@/_lib/educatorEmploymentData';
import { isLoadFailure, loadPreferences } from '@/_lib/notificationsData';
import {
  isSettingsPlanStale,
  parseCheckoutSessionId,
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
    checkout_session_id?: string | string[];
  }>;
}

/**
 * Fast-path optimistic sync right after returning from Stripe Checkout — the
 * webhook is the authoritative sync and runs independently, this just avoids
 * the UI looking stale for the few seconds it takes to arrive. A failure here
 * is silent on purpose: the webhook still lands.
 */
async function syncCheckout(sessionId: string): Promise<void> {
  await actionUpdateSubscription({ sessionId }).catch(() => undefined);
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

export default async function Settings({ searchParams }: SettingsProps) {
  const session = await auth();
  if (!session) return null;
  await redirectIfReceptionist();

  const { tab: tabParam, checkout_session_id: sessionIdParam } =
    await searchParams;
  const tab = parseSettingsTab(tabParam);
  const checkoutSessionId = parseCheckoutSessionId(sessionIdParam);
  if (checkoutSessionId) await syncCheckout(checkoutSessionId);

  const profile = await loadProfile();
  const { plans, plansFailed } = await loadPlans(tab);
  const academiaData = await loadAcademiaDataForTab(tab, profile);
  const educatorEmploymentData = await loadEducatorEmploymentTab(tab, profile);
  const prefsResult = tab === 'notificacoes' ? await loadPreferences() : null;
  const preferences =
    prefsResult && !isLoadFailure(prefsResult) ? prefsResult : null;
  const planStale = isSettingsPlanStale({
    sessionProductId: session.user?.productId,
    profile,
    checkoutSessionId,
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
          <SettingsPanel
            tab={tab}
            profile={profile}
            plans={plans}
            plansFailed={plansFailed}
            preferences={preferences}
            academiaData={academiaData}
            educatorEmploymentData={educatorEmploymentData}
          />
        </div>
      </UnsavedChangesProvider>
    </DefaultLayout>
  );
}
