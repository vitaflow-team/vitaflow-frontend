import type { InvoiceList as InvoiceListType } from '@/_types/billing';
import type { FinancialAudience } from '@/_types/financialAudience';
import type { LoadFailure } from '@/_types/loadFailure';
import { FinancialSituationChip } from './financialSituationChip';
import { InvoiceGenerationPanel } from './invoiceGenerationPanel';
import { InvoiceList } from './invoiceList';
import { PremiumInvitation } from './premiumInvitation';
import { SubscriptionRequiredNotice } from './subscriptionRequiredNotice';
import { TaxIdSection } from './taxIdSection';

interface BillingTabProps {
  clientId: string;
  basePath: string;
  invoices: InvoiceListType | LoadFailure;
  /** Who is looking: a gym owner sees the monthly fees, never the Premium invitation. */
  audience?: FinancialAudience;
}

const CONNECT_HINT: Record<FinancialAudience, string> = {
  PROFESSIONAL:
    'Conecte sua conta Asaas em Configurações para gerar cobranças.',
  GYM: 'Conecte a conta Asaas da academia em Configurações para cobrar as mensalidades.',
};

/** Shown instead of any control: Premium for a professional, a paid subscription for a gym. */
function PlanGate({ audience }: { audience: FinancialAudience }) {
  return audience === 'GYM' ? (
    <SubscriptionRequiredNotice />
  ) : (
    <PremiumInvitation />
  );
}

function failureMessage(invoices: LoadFailure): string {
  if (invoices === 'not-found') return 'Aluno não encontrado.';
  return 'Não foi possível carregar as cobranças. Tente novamente mais tarde.';
}

/** The "Cobrança" record tab, shared by both professions and the gym owner (US-003, US-004, US-016, ADR-004). */
export function BillingTab({
  clientId,
  basePath,
  invoices,
  audience = 'PROFESSIONAL',
}: BillingTabProps) {
  if (typeof invoices === 'string') {
    return (
      <p className="text-sm text-muted-foreground">
        {failureMessage(invoices)}
      </p>
    );
  }

  if (!invoices.gateway.premium) return <PlanGate audience={audience} />;

  const { connected } = invoices.gateway;
  const isGym = audience === 'GYM';

  return (
    <div className="flex flex-col gap-4">
      <FinancialSituationChip situation={invoices.situation} />
      {!connected && (
        <p className="text-sm text-muted-foreground">
          {CONNECT_HINT[audience]}
        </p>
      )}
      <TaxIdSection clientId={clientId} taxId={invoices.taxId} />
      {connected && !isGym && (
        <InvoiceGenerationPanel
          clientId={clientId}
          needsTaxId={!invoices.taxId.present}
        />
      )}
      <InvoiceList
        items={invoices.items}
        total={invoices.total}
        page={invoices.page}
        pageSize={invoices.pageSize}
        basePath={basePath}
        allowEdit={!isGym}
      />
    </div>
  );
}
