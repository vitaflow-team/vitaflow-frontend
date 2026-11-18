/** One delinquent person: the only fields a panel may show (ADR-005). */
export interface DelinquentRow {
  clientId: string;
  name: string;
  totalOwedCents: number;
  overdueCount: number;
  oldestDaysOverdue: number;
}
