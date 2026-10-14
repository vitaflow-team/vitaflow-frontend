export type UpdateStudentOutcome =
  | { outcome: 'saved' }
  | { outcome: 'account_exists'; email: string; accountName: string | null };
