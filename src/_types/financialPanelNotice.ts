/** What a panel says about its own state, above or instead of the figures. */
export interface FinancialPanelNotice {
  message: string;
  role: 'alert' | 'status';
  actionHref?: string;
  actionLabel?: string;
}
