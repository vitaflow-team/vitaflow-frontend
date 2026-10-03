/** What the register action reports; anything else is thrown as a safe error. */
export type CreateStudentOutcome =
  | { outcome: 'created'; id: string }
  | { outcome: 'account_exists'; accountName: string | null }
  | { outcome: 'already_registered' };
