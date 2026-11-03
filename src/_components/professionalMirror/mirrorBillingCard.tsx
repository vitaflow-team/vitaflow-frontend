import { InvoiceStatusChip } from '@/_components/billing/invoiceStatusChip';
import { buttonVariants } from '@/_components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/_components/ui/card';
import { monthName } from '@/_lib/billingDates';
import { formatCentsAsCurrency } from '@/_lib/currency';
import { formatDate } from '@/_lib/stringUtils';
import type { StudentBillingStatus } from '@/_types/professionalMirror';
import { Receipt } from 'lucide-react';
import { MirrorSectionCard } from './mirrorSectionCard';

interface MirrorBillingCardProps {
  billingStatus: StudentBillingStatus;
}

interface BillingSectionProps {
  billingStatus: StudentBillingStatus | null;
}

/** Shared by both mirrors: the real card, or the honest empty state (US-011, UT-130). */
export function BillingSection({ billingStatus }: BillingSectionProps) {
  if (!billingStatus) {
    return (
      <MirrorSectionCard
        title="Cobrança"
        icon={Receipt}
        emptyMessage="Nenhuma cobrança registrada ainda."
      />
    );
  }
  return <MirrorBillingCard billingStatus={billingStatus} />;
}

function OpenInvoiceContent({
  billingStatus,
}: {
  billingStatus: StudentBillingStatus;
}) {
  const invoice = billingStatus.openInvoice;
  if (!invoice) return null;

  return (
    <>
      <p className="font-medium">
        {monthName(invoice.competenceMonth)} de {invoice.competenceYear} —{' '}
        {formatCentsAsCurrency(invoice.amountCents)}
      </p>
      <p className="text-sm text-muted-foreground">
        Vencimento: {formatDate(invoice.dueDate, 'pt-BR')}
      </p>
      <InvoiceStatusChip status={invoice.status} />
      {billingStatus.otherOpenCount > 0 && (
        <p className="text-sm text-muted-foreground">
          + {billingStatus.otherOpenCount}{' '}
          {billingStatus.otherOpenCount === 1
            ? 'outra cobrança em aberto'
            : 'outras cobranças em aberto'}
        </p>
      )}
      {invoice.paymentUrl && (
        <a
          href={invoice.paymentUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={buttonVariants({ variant: 'outline' })}
        >
          Pagar agora
        </a>
      )}
    </>
  );
}

function LatestPaidContent({
  latestPaid,
}: {
  latestPaid: NonNullable<StudentBillingStatus['latestPaid']>;
}) {
  return (
    <>
      <p className="font-medium">
        {monthName(latestPaid.competenceMonth)} de {latestPaid.competenceYear} —{' '}
        {formatCentsAsCurrency(latestPaid.amountCents)}
      </p>
      <p className="text-sm text-muted-foreground">
        Pago em{' '}
        {latestPaid.paidAt ? formatDate(latestPaid.paidAt, 'pt-BR') : '—'}
      </p>
    </>
  );
}

/** The student's own invoice, read only — no tax number, no gateway account (US-011, UT-130). */
export function MirrorBillingCard({ billingStatus }: MirrorBillingCardProps) {
  return (
    <Card className="gap-3 border-line">
      <CardHeader className="grid-cols-[1fr_auto]">
        <CardTitle>Cobrança</CardTitle>
        <Receipt className="size-5 text-icon-accent" aria-hidden="true" />
      </CardHeader>
      <CardContent className="flex flex-col items-start gap-2">
        {billingStatus.openInvoice ? (
          <OpenInvoiceContent billingStatus={billingStatus} />
        ) : billingStatus.latestPaid ? (
          <LatestPaidContent latestPaid={billingStatus.latestPaid} />
        ) : null}
      </CardContent>
    </Card>
  );
}
