/**
 * One error shape a Server Action expects, keyed on a structural signal: the
 * backend status carried by `AppError`, and/or a third-party error `code`
 * (Stripe). When both are set, both must match.
 */
export interface ErrorMapping {
  status?: number;
  code?: string;
  message: string;
}
