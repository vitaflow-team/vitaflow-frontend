import type { InvoiceList as InvoiceListType } from '@/_types/billing';
import type { LoadFailure } from '@/_types/loadFailure';
import { FinancialSituationChip } from './financialSituationChip';
import { InvoiceGenerationPanel } from './invoiceGenerationPanel';
import { InvoiceList } from './invoiceList';
import { PremiumInvitation } from './premiumInvitation';
import { TaxIdSection } from './taxIdSection';

interface BillingTabProps {
  clientId: string;
  basePath: string;
  invoices: InvoiceListType | LoadFailure;
}

function failureMessage(invoices: LoadFailure): string {
  if (invoices === 'not-found') return 'Aluno não encontrado.';
  return 'Não foi possível carregar as cobranças. Tente novamente mais tarde.';
}

/** The "Cobrança" record tab, shared by both professions (US-003, US-004, ADR-004). */
export function BillingTab({ clientId, basePath, invoices }: BillingTabProps) {
  if (typeof invoices === 'string') {
    return (
      <p className="text-sm text-muted-foreground">
        {failureMessage(invoices)}
      </p>
    );
  }

  if (!invoices.gateway.premium) {
    return <PremiumInvitation />;
  }

  return (
    <div className="flex flex-col gap-4">
      <FinancialSituationChip situation={invoices.situation} />
      {!invoices.gateway.connected && (
        <p className="text-sm text-muted-foreground">
          Conecte sua conta Asaas em Configurações para gerar cobranças.
        </p>
      )}
      <TaxIdSection clientId={clientId} taxId={invoices.taxId} />
      {invoices.gateway.connected && (
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
      />
    </div>
  );
}
