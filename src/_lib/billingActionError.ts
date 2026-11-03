import { BILLING_PASSTHROUGH_CODES } from '@/_constants/billingErrors';
import { AppError } from '@/_lib/AppError';
import { toSafeActionError } from '@/_lib/safeActionError';
import { ZSAError } from 'zsa';

/**
 * The backend's own CodedError messages for billing are already safe,
 * plain-Portuguese, user-facing text (including dynamic ones, like the
 * resend cooldown's exact minutes left) — forwarded as-is for a known
 * billing code instead of being redeclared, word for word, on this side.
 * Anything else (network failures, unexpected 500s) still goes through the
 * generic safe-message mapping, which never echoes a raw error.
 */
export function toBillingActionError(action: string, error: unknown): ZSAError {
  if (
    error instanceof AppError &&
    error.code &&
    BILLING_PASSTHROUGH_CODES.has(error.code)
  ) {
    return new ZSAError('ERROR', error.message);
  }
  return toSafeActionError(action, error);
}
