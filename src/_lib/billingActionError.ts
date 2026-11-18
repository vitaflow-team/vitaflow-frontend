import {
  BILLING_PASSTHROUGH_CODES,
  GYM_BILLING_ERRORS,
} from '@/_constants/billingErrors';
import { AppError } from '@/_lib/AppError';
import {
  buildSafeActionError,
  toSafeActionError,
} from '@/_lib/safeActionError';
import { ZSAError } from 'zsa';

/**
 * The backend's own CodedError messages for billing are already safe,
 * plain-Portuguese, user-facing text (including dynamic ones, like the
 * resend cooldown's exact minutes left) — forwarded as-is for a known
 * billing code instead of being redeclared, word for word, on this side. The
 * code travels along as the error's `data`, so a form can branch on it (for
 * example to ask for a missing tax ID).
 *
 * The gym-side codes have their wording here (`GYM_BILLING_ERRORS`). Anything
 * else (network failures, unexpected 500s) still goes through the generic
 * safe-message mapping, which never echoes a raw error.
 */
export function toBillingActionError(action: string, error: unknown): ZSAError {
  if (
    error instanceof AppError &&
    error.code &&
    BILLING_PASSTHROUGH_CODES.has(error.code)
  ) {
    return buildSafeActionError(error.message, error.code);
  }
  return toSafeActionError(action, error, GYM_BILLING_ERRORS);
}
