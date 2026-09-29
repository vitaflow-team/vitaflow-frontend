import type { ErrorMapping } from '@/_types/errorMapping';
import { ZSAError } from 'zsa';
import { AppError } from './AppError';

export const SAFE_ACTION_FALLBACK =
  'Não foi possível concluir a ação. Tente novamente.';

export const TOO_MANY_REQUESTS: ErrorMapping = {
  status: 429,
  message: 'Muitas tentativas. Aguarde alguns instantes e tente novamente.',
};

function errorCode(error: unknown): unknown {
  return (error as { code?: unknown } | null | undefined)?.code;
}

// Only `AppError` carries a backend status; a Stripe error also has a
// `statusCode`, but that is Stripe's, not the backend's, so it never matches.
function matches(error: unknown, entry: ErrorMapping): boolean {
  if (entry.status === undefined && entry.code === undefined) return false;
  if (entry.status !== undefined) {
    if (!(error instanceof AppError) || error.statusCode !== entry.status) {
      return false;
    }
  }
  return entry.code === undefined || errorCode(error) === entry.code;
}

/**
 * Picks the safe message for an error the action expects, or the fallback.
 * The error's own `.message` is never returned: it may carry backend or
 * Stripe internals (ADR-002).
 */
export function mapKnownError(
  error: unknown,
  table: ErrorMapping[],
  fallback: string = SAFE_ACTION_FALLBACK
): string {
  return table.find(entry => matches(error, entry))?.message ?? fallback;
}

// Structural fields only: messages from the backend or Stripe can echo what
// the user typed (an e-mail, for instance), so they stay out of the log.
function logActionError(action: string, error: unknown): void {
  const details = error as
    | { name?: unknown; statusCode?: unknown; code?: unknown; type?: unknown }
    | null
    | undefined;
  console.error(`Server Action "${action}" failed.`, {
    name: details?.name,
    status: details?.statusCode,
    code: details?.code,
    type: details?.type,
  });
}

/**
 * Turns whatever an action's `try` caught into a `ZSAError` with a safe
 * message. A `ZSAError` the action threw itself already carries a safe,
 * hand-written message and passes through untouched.
 */
export function toSafeActionError(
  action: string,
  error: unknown,
  table: ErrorMapping[] = []
): ZSAError {
  if (error instanceof ZSAError) return error;
  logActionError(action, error);
  return new ZSAError('ERROR', mapKnownError(error, table));
}
