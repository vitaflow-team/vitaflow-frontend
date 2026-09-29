import type { Product } from '@/_actions/products/getPlans';
import { AccountPanel } from '@/_components/settings/accountPanel';
import { PlanPanel } from '@/_components/settings/planPanel';
import { Title } from '@/_components/ui/title';
import { toFormSettingsProfile } from '@/_lib/formSettingsProfile';
import {
  hasPaidSubscription,
  isProfessionalProfile,
  profileClientsCount,
} from '@/_lib/settingsProfile';
import type { SettingsTab } from '@/_lib/settingsTabs';
import type { SettingsProfile } from '@/_types/settingsProfile';
import FormSettings from './form';

function PanelTitle({ label }: { label: string }) {
  return (
    <Title
      label={label}
      size="h2"
      className="border-b border-primary text-left"
    />
  );
}

interface ProfilePanelProps {
  profile: SettingsProfile;
}

export function AccountSettingsPanel({ profile }: ProfilePanelProps) {
  return (
    <>
      <PanelTitle label="Minha conta" />
      <AccountPanel
        email={profile.email}
        clientsCount={profileClientsCount(profile)}
        isProfessional={isProfessionalProfile(profile)}
        hasPaidSubscription={hasPaidSubscription(profile)}
      />
    </>
  );
}

interface PlanSettingsPanelProps extends ProfilePanelProps {
  plans: Product[];
  plansFailed: boolean;
}

export function PlanSettingsPanel({
  profile,
  plans,
  plansFailed,
}: PlanSettingsPanelProps) {
  return (
    <>
      <PanelTitle label="Meu plano" />
      <PlanPanel
        plans={plans}
        productId={profile.productId}
        // From the freshly loaded profile, not the session: right after a
        // plan change the session still carries the old type (ADR-008).
        profileType={profile.productType}
        hasActiveSubscription={hasPaidSubscription(profile)}
        subscriptionCancelAt={profile.subscriptionCancelAt ?? null}
        expiresAt={profile.expiresAt ?? null}
        autoRenew={profile.autoRenew ?? false}
        clientsCount={profileClientsCount(profile)}
        loadFailed={plansFailed}
      />
    </>
  );
}

interface SettingsPanelProps {
  tab: SettingsTab;
  profile: SettingsProfile | null;
  plans: Product[];
  plansFailed: boolean;
}

/**
 * Content of the selected tab. A load failure replaces only this content: the
 * tab strip stays up so the user can move to another section (US-001.EC-5).
 */
export function SettingsPanel({
  tab,
  profile,
  plans,
  plansFailed,
}: SettingsPanelProps) {
  if (!profile) {
    return <div>Erro ao carregar perfil. Tente novamente mais tarde.</div>;
  }

  if (tab === 'conta') return <AccountSettingsPanel profile={profile} />;

  if (tab === 'perfil') {
    return (
      <>
        <PanelTitle label="Meu perfil" />
        <FormSettings profile={toFormSettingsProfile(profile)} />
      </>
    );
  }

  return (
    <PlanSettingsPanel
      profile={profile}
      plans={plans}
      plansFailed={plansFailed}
    />
  );
}
