/** The three money figures of a month, in integer cents. */
export interface FinancialMonthTotals {
  expectedCents: number;
  receivedCents: number;
  stillOwedCents: number;
}
