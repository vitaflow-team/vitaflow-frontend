import { actionGetPlans, type Product } from '@/_actions/products/getPlans';
import { actionUpdateSubscription } from '@/_actions/users/postUpdateSubscription';
import DefaultLayout from '@/_components/layout/defaultLayout';
import { AccountPanel } from '@/_components/settings/accountPanel';
import { PlanPanel } from '@/_components/settings/planPanel';
import { PlanSessionSync } from '@/_components/settings/planSessionSync';
import { SettingsBreadcrumb } from '@/_components/settings/settingsBreadcrumb';
import { SettingsTabs } from '@/_components/settings/settingsTabs';
import { UnsavedChangesProvider } from '@/_components/settings/unsavedChangesProvider';
import { Title } from '@/_components/ui/title';
import { PAGE_TITLES } from '@/_constants/pageTitles';
import { apiClient } from '@/_lib/apiClient';
import { isSessionPlanStale } from '@/_lib/sessionPlan';
import {
  parseSettingsTab,
  settingsPanelId,
  settingsTabId,
} from '@/_lib/settingsTabs';
import { profileFormData } from '@/_schema/profile';
import { auth } from '@/auth';
import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import FormSettings from './form';

export const metadata: Metadata = {
  title: PAGE_TITLES.settings,
};

const ACTIVE_STATUSES = ['active', 'trialing', 'past_due'];

const PROFESSIONAL_TYPES = ['NUTRITIONIST', 'PHYSICAL_EDUCATOR'];

type SettingsProfile = Omit<profileFormData, 'avatar'> & {
  avatar?: string | null;
  productId?: string | null;
  /** Tipo e grupo do produto atual, verdade do servidor para acesso e seções. */
  productType?: string | null;
  productGroupId?: string | null;
  subscriptionStatus?: string | null;
  subscriptionCancelAt?: string | null;
  subscriptionCurrentPeriodEnd?: string | null;
  /** Data e renovação do plano já derivadas pelo backend (ADR-004). */
  expiresAt?: string | null;
  autoRenew?: boolean | null;
  /** `0` para quem não é profissional; ausente se o backend não mandar (ADR-008). */
  clientsCount?: number | null;
};

interface SettingsProps {
  searchParams: Promise<{
    tab?: string | string[];
    checkout_session_id?: string | string[];
  }>;
}

export default async function Settings({ searchParams }: SettingsProps) {
  const session = await auth();
  if (!session) return null;

  const { tab: tabParam, checkout_session_id: sessionIdParam } =
    await searchParams;

  const tab = parseSettingsTab(tabParam);
  const checkoutSessionId =
    typeof sessionIdParam === 'string' ? sessionIdParam : undefined;

  if (checkoutSessionId) {
    // Fast-path optimistic sync right after returning from Stripe Checkout
    // — the webhook is the authoritative sync and runs independently, this
    // just avoids the UI looking stale for the few seconds it takes to
    // arrive. A failure here is silent on purpose: the webhook still lands.
    await actionUpdateSubscription({ sessionId: checkoutSessionId }).catch(
      () => undefined
    );
  }

  let profile: SettingsProfile | null = null;
  try {
    profile = await apiClient<SettingsProfile>('/profile', {
      method: 'GET',
    });
  } catch (error) {
    console.error('Falha ao carregar perfil:', error);
  }

  // O catálogo inteiro em uma chamada só; a troca de categoria filtra essa
  // lista em memória, sem voltar à rede (ADR-003).
  let plans: Product[] = [];
  // A falha precisa ser distinguível de "catálogo vazio": só ela troca o
  // painel por uma mensagem de erro (US-006.EC-3).
  let plansFailed = false;
  if (tab === 'plano') {
    const [catalog, plansError] = await actionGetPlans();
    plans = catalog ?? [];
    plansFailed = Boolean(plansError);
  }

  // O plano da sessão congela no login; o perfil é a verdade do servidor. A
  // volta do checkout entra junto porque a sincronização otimista acima pode
  // ter acabado de mudar o produto (ADR-008).
  const planStale = Boolean(
    profile &&
      (isSessionPlanStale(
        { productId: session.user?.productId },
        { productId: profile.productId }
      ) ||
        checkoutSessionId)
  );

  // A falha de carregamento troca só o conteúdo do painel: a tira de abas
  // continua de pé para que o usuário possa ir para outra seção (US-001.EC-5).
  let panel: ReactNode;

  if (!profile) {
    panel = <div>Erro ao carregar perfil. Tente novamente mais tarde.</div>;
  } else if (tab === 'conta') {
    panel = (
      <>
        <Title
          label="Minha conta"
          size="h2"
          className="border-b border-primary text-left"
        />
        <AccountPanel
          email={profile.email}
          // `undefined` (backend antigo ou campo ausente) vira `null` para o
          // diálogo distinguir "nenhum aluno" de "não deu para contar".
          clientsCount={
            typeof profile.clientsCount === 'number'
              ? profile.clientsCount
              : null
          }
          // Vem do perfil recém-lido, não da sessão: logo após uma troca de
          // plano a sessão ainda carrega o tipo antigo (ADR-008).
          isProfessional={PROFESSIONAL_TYPES.includes(
            profile.productType ?? ''
          )}
          hasPaidSubscription={ACTIVE_STATUSES.includes(
            profile.subscriptionStatus ?? ''
          )}
        />
      </>
    );
  } else if (tab === 'perfil') {
    panel = (
      <>
        <Title
          label="Meu perfil"
          size="h2"
          className="border-b border-primary text-left"
        />
        <FormSettings profile={profile} />
      </>
    );
  } else {
    panel = (
      <>
        <Title
          label="Meu plano"
          size="h2"
          className="border-b border-primary text-left"
        />
        <PlanPanel
          plans={plans}
          productId={profile.productId}
          // Vem do perfil recém-lido, não da sessão: logo após uma troca de
          // plano a sessão ainda carrega o tipo antigo (ADR-008).
          profileType={profile.productType}
          hasActiveSubscription={ACTIVE_STATUSES.includes(
            profile.subscriptionStatus ?? ''
          )}
          subscriptionCancelAt={profile.subscriptionCancelAt ?? null}
          expiresAt={profile.expiresAt ?? null}
          autoRenew={profile.autoRenew ?? false}
          clientsCount={
            typeof profile.clientsCount === 'number'
              ? profile.clientsCount
              : null
          }
          loadFailed={plansFailed}
        />
      </>
    );
  }

  return (
    <DefaultLayout>
      {/* O layout do app leu a sessão antes da sincronização acima; sem este
          passo o menu e o bloco de plano continuariam no estado anterior até
          um novo login (ADR-004, ADR-008). */}
      <PlanSessionSync stale={planStale} />
      <SettingsBreadcrumb tab={tab} />
      <Title label={PAGE_TITLES.settings} className="text-left" />
      <SettingsTabs selected={tab} />
      <UnsavedChangesProvider>
        <div
          role="tabpanel"
          id={settingsPanelId(tab)}
          aria-labelledby={settingsTabId(tab)}
          tabIndex={0}
          className="flex flex-col gap-2 pt-4 focus-visible:outline-hidden"
        >
          {panel}
        </div>
      </UnsavedChangesProvider>
    </DefaultLayout>
  );
}
