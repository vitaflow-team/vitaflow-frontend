/** The current overdue situation: total, delinquent people and aging bands. */
export interface FinancialOverdue {
  totalCents: number;
  delinquentCount: number;
  bands: {
    d1to7Cents: number;
    d8to30Cents: number;
    d31PlusCents: number;
  };
}
