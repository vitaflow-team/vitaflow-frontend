/** What the monthly fee fields of the plan panel hold while the owner types. */
export interface BillingFormValues {
  dueDay: number;
  /** The amount as typed, in reais: `149,90`. */
  amountText: string;
  /** The tax ID as typed, or empty. */
  cpfCnpj: string;
}
