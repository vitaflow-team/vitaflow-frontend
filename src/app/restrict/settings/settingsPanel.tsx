import type { Product } from '@/_actions/products/getPlans';
import { AcademiaSettingsPanel } from '@/_components/academia/academiaSettingsPanel';
import { BillingSettingsPanel } from '@/_components/billing/billingSettingsPanel';
import { AccountPanel } from '@/_components/settings/accountPanel';
import { NotificationPreferencesPanel } from '@/_components/settings/notificationPreferencesPanel';
import { PlanPanel } from '@/_components/settings/planPanel';
import { EducatorEmploymentPanel } from '@/_components/educatorEmployment/educatorEmploymentPanel';
import { Title } from '@/_components/ui/title';
import type { EducatorEmployment } from '@/_types/educatorEmployment';
import type { AcademiaSettingsData } from '@/_lib/academiaSettingsData';
import { toFormSettingsProfile } from '@/_lib/formSettingsProfile';
import {
  hasPaidSubscription,
  isProfessionalProfile,
  profileClientsCount,
} from '@/_lib/settingsProfile';
import type { SettingsTab } from '@/_lib/settingsTabs';
import type { BillingAccount } from '@/_types/billing';
import type { LoadFailure } from '@/_types/loadFailure';
import type { NotificationPreferences } from '@/_types/notifications';
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

interface AcademiaTabPanelProps {
  profile: SettingsProfile | null;
  academiaData: AcademiaSettingsData | null;
}

function AcademiaTabPanel({ profile, academiaData }: AcademiaTabPanelProps) {
  if (!profile || profile.productType !== 'ACADEMIA' || !academiaData) {
    return <div>Esta área não está disponível para o seu tipo de conta.</div>;
  }
  return (
    <>
      <PanelTitle label="Academia" />
      <AcademiaSettingsPanel data={academiaData} />
    </>
  );
}

interface VinculosTabPanelProps {
  profile: SettingsProfile | null;
  educatorEmployments: EducatorEmployment[] | null;
}

function VinculosTabPanel({
  profile,
  educatorEmployments,
}: VinculosTabPanelProps) {
  if (
    !profile ||
    profile.productType !== 'PHYSICAL_EDUCATOR' ||
    !educatorEmployments
  ) {
    return <div>Esta área não está disponível para o seu tipo de conta.</div>;
  }
  return (
    <>
      <PanelTitle label="Vínculos com academias" />
      <EducatorEmploymentPanel employments={educatorEmployments} />
    </>
  );
}

function NotificationsTabPanel({
  preferences,
}: {
  preferences: NotificationPreferences | null;
}) {
  if (!preferences) {
    return (
      <div>Erro ao carregar preferências. Tente novamente mais tarde.</div>
    );
  }
  return (
    <>
      <PanelTitle label="Notificações" />
      <NotificationPreferencesPanel preferences={preferences} />
    </>
  );
}

function PerfilTabPanel({ profile }: { profile: SettingsProfile }) {
  return (
    <>
      <PanelTitle label="Meu perfil" />
      <FormSettings profile={toFormSettingsProfile(profile)} />
    </>
  );
}

interface SettingsPanelProps {
  tab: SettingsTab;
  profile: SettingsProfile | null;
  plans: Product[];
  plansFailed: boolean;
  preferences: NotificationPreferences | null;
  academiaData: AcademiaSettingsData | null;
  educatorEmployments: EducatorEmployment[] | null;
  billingAccount: BillingAccount | LoadFailure | null;
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
  preferences,
  academiaData,
  educatorEmployments,
  billingAccount,
}: SettingsPanelProps) {
  if (tab === 'cobranca') {
    return <BillingSettingsPanel account={billingAccount} />;
  }

  if (tab === 'academia') {
    return <AcademiaTabPanel profile={profile} academiaData={academiaData} />;
  }

  if (tab === 'vinculos') {
    return (
      <VinculosTabPanel
        profile={profile}
        educatorEmployments={educatorEmployments}
      />
    );
  }

  if (tab === 'notificacoes') {
    return <NotificationsTabPanel preferences={preferences} />;
  }

  if (!profile) {
    return <div>Erro ao carregar perfil. Tente novamente mais tarde.</div>;
  }

  if (tab === 'conta') return <AccountSettingsPanel profile={profile} />;

  if (tab === 'perfil') return <PerfilTabPanel profile={profile} />;

  return (
    <PlanSettingsPanel
      profile={profile}
      plans={plans}
      plansFailed={plansFailed}
    />
  );
}
