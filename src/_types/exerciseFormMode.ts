/**
 * Who is saving the exercise form: an educator proposing one (`submit`), or
 * the backoffice creating or editing a catalog entry directly.
 */
export type ExerciseFormMode =
  | { kind: 'submit' }
  | { kind: 'create' }
  | { kind: 'edit'; id: string };
