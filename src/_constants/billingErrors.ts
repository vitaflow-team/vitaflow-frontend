import { TOO_MANY_REQUESTS } from '@/_lib/safeActionError';
import type { ErrorMapping } from '@/_types/errorMapping';

export const STUDENT_NOT_FOUND_MESSAGE = 'Aluno não encontrado.';
export const INVOICE_NOT_FOUND_MESSAGE = 'Cobrança não encontrada.';
export const PREMIUM_REQUIRED_MESSAGE = 'Este recurso requer o plano Premium.';
export const NOT_CONNECTED_MESSAGE = 'Conecte sua conta Asaas para continuar.';

// The backend's own CodedError messages are already plain, safe Portuguese
// written for exactly this purpose (e.g. the resend cooldown's exact minutes
// left) — these codes are passed through as-is instead of being redeclared
// here, see `toBillingActionError`.
export const BILLING_PASSTHROUGH_CODES = new Set([
  'premium_required',
  'gateway_not_connected',
  'gateway_auth_failed',
  'gateway_unavailable',
  'gateway_rejected',
  'invoice_exists_for_month',
  'invoice_invalid',
  'invoice_not_open',
  'invoice_already_paid',
  'resend_too_soon',
  'tax_id_required',
  'tax_id_invalid',
  'account_key_in_use',
  'student_not_found',
  'invoice_not_found',
]);

export const BILLING_VALIDATION: ErrorMapping = {
  status: 400,
  message: 'Verifique os dados informados e tente novamente.',
};

export const BILLING_LOOKUP_ERRORS: ErrorMapping[] = [
  TOO_MANY_REQUESTS,
  BILLING_VALIDATION,
];
