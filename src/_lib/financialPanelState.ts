import type { FinancialHealthSummary } from '@/_types/financialHealthSummary';
import type { FinancialPanelState } from '@/_types/financialPanelState';

type StateInput = Pick<FinancialHealthSummary, 'billingState' | 'hasHistory'>;

/**
 * The state a panel is in, from the account state and whether any invoice ever
 * existed. `canBill` is `false` only when the owner's plan can no longer issue
 * invoices; unknown (`null`) never changes the state.
 */
export function panelStateOf(
  { billingState, hasHistory }: StateInput,
  canBill: boolean | null
): FinancialPanelState {
  if (billingState === 'RECONNECT_NEEDED') return 'RECONNECT';
  if (billingState === 'NOT_CONNECTED') {
    if (!hasHistory) return 'EMPTY';
    return canBill === false ? 'PREMIUM_LOST' : 'HISTORY_ONLY';
  }
  return hasHistory ? 'READY' : 'ZERO';
}

/** Only the empty state hides the figures: zeros there would read as data. */
export function showsFigures(state: FinancialPanelState): boolean {
  return state !== 'EMPTY';
}
