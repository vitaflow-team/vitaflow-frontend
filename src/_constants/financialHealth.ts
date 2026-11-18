export const FINANCIAL_PANEL_PATHS = {
  PROFESSIONAL: '/restrict/financeiro',
  GYM: '/restrict/academia-financeiro',
} as const;

/** How many months before the current one a panel may open. */
export const FINANCIAL_MONTHS_BACK = 12;

/** Anchor of the delinquent list, so paging lands on it. */
export const DELINQUENTS_ANCHOR = 'inadimplentes';
