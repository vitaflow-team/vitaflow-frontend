import type { ErrorMapping } from '@/_types/errorMapping';

/** This feature's own error-mapping table for `toSafeActionError`
 * (`postConversation.ts`) — mirrors `workoutErrors.ts`'s shape, but with
 * `PREMIUM_REQUIRED`'s `code` set correctly from the start (ADR-009 is
 * fixing the workout one; this one never had the bug). */

export const PREMIUM_REQUIRED_MESSAGE =
  'Geração de plano alimentar com IA requer o plano Premium.';

export const CONFIRM_OVERWRITE_REQUIRED_MESSAGE =
  'Este plano já tem refeições definidas. Confirme para sobrescrevê-lo.';

export const LLM_CALL_FAILED_MESSAGE =
  'A IA está indisponível no momento. Tente novamente em instantes.';

export const INVALID_ANSWER_MESSAGE = 'Verifique a resposta e tente novamente.';

export const PREMIUM_REQUIRED: ErrorMapping = {
  status: 402,
  code: 'premium_required',
  message: PREMIUM_REQUIRED_MESSAGE,
};

/** Same status/code/message `cloneDay`'s own overwrite check already uses
 * (ADR-013) — reused here, not reinvented. */
export const CONFIRM_OVERWRITE_REQUIRED: ErrorMapping = {
  status: 409,
  code: 'confirm_overwrite_required',
  message: CONFIRM_OVERWRITE_REQUIRED_MESSAGE,
};

export const LLM_CALL_FAILED: ErrorMapping = {
  status: 502,
  code: 'llm_call_failed',
  message: LLM_CALL_FAILED_MESSAGE,
};

export const INVALID_ANSWER: ErrorMapping = {
  status: 400,
  message: INVALID_ANSWER_MESSAGE,
};
