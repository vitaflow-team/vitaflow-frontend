import { formatCentsAsCurrency } from '@/_lib/currency';
import { monthName } from '@/_lib/billingDates';
import { formatDate } from '@/_lib/stringUtils';
import type { Invoice } from '@/_types/billing';
import { CancelInvoiceDialog } from './cancelInvoiceDialog';
import { EditInvoiceDialog } from './editInvoiceDialog';
import { InvoiceStatusChip } from './invoiceStatusChip';
import { MarkPaidInvoiceDialog } from './markPaidInvoiceDialog';
import { ResendInvoiceDialog } from './resendInvoiceDialog';

interface InvoiceRowProps {
  invoice: Invoice;
}

/** One invoice: its facts, and, only while open, its actions (US-005 through US-008). */
export function InvoiceRow({ invoice }: InvoiceRowProps) {
  const isOpen = invoice.status === 'PENDING' || invoice.status === 'OVERDUE';

  return (
    <li className="flex flex-col gap-2 rounded-lg border p-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="font-medium">
          {monthName(invoice.competenceMonth)} de {invoice.competenceYear}
        </span>
        <InvoiceStatusChip status={invoice.status} />
      </div>
      <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
        <span>{formatCentsAsCurrency(invoice.amountCents)}</span>
        <span>Vencimento: {formatDate(invoice.dueDate, 'pt-BR')}</span>
        {invoice.paidAt && (
          <span>Pago em: {formatDate(invoice.paidAt, 'pt-BR')}</span>
        )}
      </div>
      {isOpen && (
        <div className="flex flex-wrap gap-2 pt-1">
          <EditInvoiceDialog invoice={invoice} />
          <MarkPaidInvoiceDialog invoiceId={invoice.id} />
          <ResendInvoiceDialog
            invoiceId={invoice.id}
            canResendAt={invoice.canResendAt}
          />
          <CancelInvoiceDialog invoiceId={invoice.id} />
        </div>
      )}
    </li>
  );
}
