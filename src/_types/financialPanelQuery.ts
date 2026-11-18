/** The validated address of a panel: `month` is `YYYY-MM`, `page` is 1-based. */
export interface FinancialPanelQuery {
  month: string;
  page: number;
}
