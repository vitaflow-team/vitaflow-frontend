import { Title } from '@/_components/ui/title';
import type { BillingAccount } from '@/_types/billing';
import type { LoadFailure } from '@/_types/loadFailure';
import { BillingAccountCard } from './billingAccountCard';
import { ConnectAccountForm } from './connectAccountForm';
import { PremiumInvitation } from './premiumInvitation';

interface BillingSettingsPanelProps {
  account: BillingAccount | LoadFailure | null;
}

function BillingPanelBody({ account }: BillingSettingsPanelProps) {
  if (!account || typeof account === 'string') {
    return (
      <p>
        Erro ao carregar a conexão com o gateway. Tente novamente mais tarde.
      </p>
    );
  }

  if (!account.premium) {
    return <PremiumInvitation />;
  }

  if (!account.connected) {
    return (
      <div className="flex flex-col gap-3">
        <p className="text-muted-foreground text-sm">
          Conecte sua conta Asaas para gerar cobranças. Os pagamentos vão direto
          para a sua conta — a Vita Flow nunca tem acesso ao dinheiro.
        </p>
        <ConnectAccountForm submitLabel="Conectar" />
      </div>
    );
  }

  return <BillingAccountCard account={account} />;
}

/** The "Cobrança" tab of Configurações (US-001, US-002, US-014). */
export function BillingSettingsPanel({ account }: BillingSettingsPanelProps) {
  return (
    <>
      <Title
        label="Cobrança"
        size="h2"
        className="border-b border-primary text-left"
      />
      <BillingPanelBody account={account} />
    </>
  );
}
