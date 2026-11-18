/** Whole-number change against the previous month; `null` when there is no base. */
export interface FinancialMonthChanges {
  expected: number | null;
  received: number | null;
  stillOwed: number | null;
}
