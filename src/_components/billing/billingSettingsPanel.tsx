import { Title } from '@/_components/ui/title';
import type { BillingAccount } from '@/_types/billing';
import type { FinancialAudience } from '@/_types/financialAudience';
import type { LoadFailure } from '@/_types/loadFailure';
import { BillingAccountCard } from './billingAccountCard';
import { ConnectAccountForm } from './connectAccountForm';
import { PremiumInvitation } from './premiumInvitation';
import { SubscriptionRequiredNotice } from './subscriptionRequiredNotice';

interface BillingSettingsPanelProps {
  account: BillingAccount | LoadFailure | null;
  /** Who is looking: a gym owner is asked for a subscription, never for Premium. */
  audience: FinancialAudience;
}

const CONNECT_HINT: Record<FinancialAudience, string> = {
  PROFESSIONAL:
    'Conecte sua conta Asaas para gerar cobranças. Os pagamentos vão direto para a sua conta — a Vita Flow nunca tem acesso ao dinheiro.',
  GYM: 'Conecte a conta Asaas da academia para cobrar a mensalidade dos alunos. Os pagamentos vão direto para a conta da academia — a Vita Flow nunca tem acesso ao dinheiro.',
};

function BillingPanelBody({ account, audience }: BillingSettingsPanelProps) {
  if (!account || typeof account === 'string') {
    return (
      <p>
        Erro ao carregar a conexão com o gateway. Tente novamente mais tarde.
      </p>
    );
  }

  if (!account.premium) {
    return audience === 'GYM' ? (
      <SubscriptionRequiredNotice />
    ) : (
      <PremiumInvitation />
    );
  }

  if (!account.connected) {
    return (
      <div className="flex flex-col gap-3">
        <p className="text-muted-foreground text-sm">
          {CONNECT_HINT[audience]}
        </p>
        <ConnectAccountForm submitLabel="Conectar" />
      </div>
    );
  }

  return <BillingAccountCard account={account} />;
}

/** The "Cobrança" tab of Configurações (US-001, US-002, US-014). */
export function BillingSettingsPanel({
  account,
  audience,
}: BillingSettingsPanelProps) {
  return (
    <>
      <Title
        label="Cobrança"
        size="h2"
        className="border-b border-primary text-left"
      />
      <BillingPanelBody account={account} audience={audience} />
    </>
  );
}
