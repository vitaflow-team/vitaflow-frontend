import { AppError } from '@/_lib/AppError';

/** Whether the backend answered with this status and, optionally, this code. */
export function isBackendError(
  error: unknown,
  status: number,
  code?: string
): boolean {
  return (
    error instanceof AppError &&
    error.statusCode === status &&
    (code === undefined || error.code === code)
  );
}
