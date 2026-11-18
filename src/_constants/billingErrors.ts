import { ACCESS_PLAN_NOT_FOUND } from '@/_constants/academiaErrors';
import { GYM_BILLING_LIMITS } from '@/_constants/gymBilling';
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

export const SUBSCRIPTION_REQUIRED: ErrorMapping = {
  status: 403,
  code: 'subscription_required',
  message: 'Este recurso requer uma assinatura ativa da academia.',
};

export const NOT_BILLING_OWNER: ErrorMapping = {
  status: 403,
  code: 'not_billing_owner',
  message:
    'Apenas profissionais independentes e donos de academia acessam este recurso.',
};

export const MANUAL_INVOICE_NOT_ALLOWED: ErrorMapping = {
  status: 403,
  code: 'manual_invoice_not_allowed',
  message:
    'As mensalidades da academia são geradas automaticamente. Não é possível criar ou editar cobranças manualmente.',
};

export const STUDENT_BILLED_BY_GYM: ErrorMapping = {
  status: 403,
  code: 'student_billed_by_gym',
  message: 'Este aluno é cobrado pela academia.',
};

export const INVALID_DUE_DAY: ErrorMapping = {
  status: 400,
  code: 'invalid_due_day',
  message: `O dia de vencimento deve ser um número de ${GYM_BILLING_LIMITS.dueDayMin} a ${GYM_BILLING_LIMITS.dueDayMax}.`,
};

export const INVALID_AMOUNT: ErrorMapping = {
  status: 400,
  code: 'invalid_amount',
  message: 'O valor da mensalidade está fora do limite permitido.',
};

export const RECURRING_BILLING_EXISTS: ErrorMapping = {
  status: 409,
  code: 'recurring_billing_exists',
  message:
    'Este aluno já tem cobrança recorrente. Altere ou encerre o plano atual primeiro.',
};

export const BILLING_NOT_CONNECTED: ErrorMapping = {
  status: 409,
  code: 'billing_not_connected',
  message:
    'Conecte a conta Asaas da academia em Configurações para cobrar as mensalidades.',
};

export const BILLING_RECONNECT_NEEDED: ErrorMapping = {
  status: 409,
  code: 'billing_reconnect_needed',
  message:
    'A chave Asaas da academia precisa ser reconectada em Configurações antes de emitir cobranças.',
};

export const RECURRING_BILLING_NOT_FOUND: ErrorMapping = {
  status: 404,
  code: 'recurring_billing_not_found',
  message: 'Este aluno não tem cobrança recorrente ativa.',
};

export const EMPTY_SELECTION: ErrorMapping = {
  status: 400,
  code: 'empty_selection',
  message: 'Selecione ao menos um aluno.',
};

export const SELECTION_TOO_LARGE: ErrorMapping = {
  status: 400,
  code: 'selection_too_large',
  message: `Selecione no máximo ${GYM_BILLING_LIMITS.bulkActivationMaxItems} alunos por vez.`,
};

export const STUDENT_HAS_NO_PLAN: ErrorMapping = {
  status: 404,
  code: 'student_has_no_plan',
  message: 'Este aluno não tem plano de acesso.',
};

// Codes the gym-side billing flows add. Their wording lives here, in
// Portuguese, instead of leaning on the backend text, so the screens say the
// same thing whatever the backend message is. `tax_id_required` and the
// gateway codes stay in the passthrough set above.
export const GYM_BILLING_ERRORS: ErrorMapping[] = [
  SUBSCRIPTION_REQUIRED,
  NOT_BILLING_OWNER,
  MANUAL_INVOICE_NOT_ALLOWED,
  STUDENT_BILLED_BY_GYM,
  INVALID_DUE_DAY,
  INVALID_AMOUNT,
  RECURRING_BILLING_EXISTS,
  BILLING_NOT_CONNECTED,
  BILLING_RECONNECT_NEEDED,
  RECURRING_BILLING_NOT_FOUND,
  EMPTY_SELECTION,
  SELECTION_TOO_LARGE,
  STUDENT_HAS_NO_PLAN,
  ACCESS_PLAN_NOT_FOUND,
];

export const BILLING_VALIDATION: ErrorMapping = {
  status: 400,
  message: 'Verifique os dados informados e tente novamente.',
};

export const BILLING_LOOKUP_ERRORS: ErrorMapping[] = [
  TOO_MANY_REQUESTS,
  BILLING_VALIDATION,
];
