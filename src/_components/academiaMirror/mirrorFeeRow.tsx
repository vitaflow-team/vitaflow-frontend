import { buttonVariants } from '@/_components/ui/button';
import { formatBRL } from '@/_lib/financialHealthDisplay';
import { formatDate } from '@/_lib/stringUtils';
import type { MembershipFee } from '@/_types/membershipFee';
import { FeeStatusChip } from './feeStatusChip';

interface MirrorFeeRowProps {
  fee: MembershipFee;
}

/** One fee: amount, due date and status; only an unpaid fee with a payment link offers "Pagar agora". */
export function MirrorFeeRow({ fee }: MirrorFeeRowProps) {
  const canPay = fee.status !== 'PAID' && fee.paymentUrl !== null;

  return (
    <li className="flex flex-wrap items-center justify-between gap-2 rounded-md border border-line p-3">
      <div className="flex flex-col gap-1">
        <span className="font-medium">{formatBRL(fee.amountCents)}</span>
        <span className="text-sm text-muted-foreground">
          Vencimento: {formatDate(fee.dueDate, 'pt-BR')}
        </span>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <FeeStatusChip status={fee.status} />
        {canPay && (
          <a
            href={fee.paymentUrl ?? undefined}
            target="_blank"
            rel="noopener noreferrer"
            className={buttonVariants({ variant: 'outline', size: 'sm' })}
          >
            Pagar agora
          </a>
        )}
      </div>
    </li>
  );
}
