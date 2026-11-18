/**
 * What a panel can be in: `EMPTY` (nothing to show yet), `RECONNECT` and
 * `HISTORY_ONLY` (figures plus a notice), `PREMIUM_LOST` (history-only for an
 * owner whose plan can no longer bill), `ZERO` (connected, nothing issued) and
 * `READY`.
 */
export type FinancialPanelState =
  | 'EMPTY'
  | 'RECONNECT'
  | 'HISTORY_ONLY'
  | 'PREMIUM_LOST'
  | 'ZERO'
  | 'READY';
