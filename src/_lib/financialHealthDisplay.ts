import { formatCentsAsCurrency } from '@/_lib/currency';
import type { FinancialHealthSummary } from '@/_types/financialHealthSummary';
import type { FinancialMonthChanges } from '@/_types/financialMonthChanges';

export const NO_COMPARISON_LABEL = 'Sem comparação';

/** BRL from integer cents (the wire format of every amount). */
export function formatBRL(cents: number): string {
  return formatCentsAsCurrency(cents);
}

/** Whole-number change; `null` when the previous month is zero (no base). */
export function changeVsPrevious(
  current: number,
  previous: number
): number | null {
  if (previous === 0) return null;
  return Math.round(((current - previous) / previous) * 100);
}

/** "+20%", "-5%", "0%", or the no-comparison label. */
export function formatChange(change: number | null): string {
  if (change === null) return NO_COMPARISON_LABEL;
  return `${change > 0 ? '+' : ''}${change}%`;
}

export function monthChanges(
  summary: Pick<FinancialHealthSummary, 'current' | 'previous'>
): FinancialMonthChanges {
  const { current, previous } = summary;
  return {
    expected: changeVsPrevious(current.expectedCents, previous.expectedCents),
    received: changeVsPrevious(current.receivedCents, previous.receivedCents),
    stillOwed: changeVsPrevious(
      current.stillOwedCents,
      previous.stillOwedCents
    ),
  };
}

/** "1 dia", "12 dias". */
export function formatDays(days: number): string {
  return `${days} ${days === 1 ? 'dia' : 'dias'}`;
}
