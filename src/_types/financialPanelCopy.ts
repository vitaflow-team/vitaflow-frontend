/** Audience-specific wording of a panel (Portuguese UI copy). */
export interface FinancialPanelCopy {
  title: string;
  /** One sentence under the title on what the figures mean. */
  intro: string;
  /** Plural of the person being billed, lowercase: "alunos", "pacientes". */
  people: string;
  /** Label for the number of overdue items of a person. */
  overdueColumn: string;
  noOverdue: string;
  emptyDelinquents: string;
  zeroHint: string;
  connectHint: string;
  lockedHint: string;
}
