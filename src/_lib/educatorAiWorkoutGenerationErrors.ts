import {
  STUDENT_GONE_MESSAGE,
  WORKOUT_NOT_FOUND_MESSAGE,
} from '@/_constants/workoutErrors';
import type { ErrorMapping } from '@/_types/errorMapping';
import { TOO_MANY_REQUESTS } from '@/_lib/safeActionError';

/** This feature's own error-mapping table for `toSafeActionError`
 * (`postEducatorAiWorkoutConversation.ts`) — mirrors
 * `mealPlanGenerationErrors.ts`'s shape for its own backend codes. */

export const PREMIUM_REQUIRED_MESSAGE =
  'Geração de treino com IA requer o plano Premium.';

export const CONFIRM_OVERWRITE_REQUIRED_MESSAGE =
  'Este rascunho foi editado manualmente desde a última geração. Confirme para sobrescrevê-lo.';

export const NO_ELIGIBLE_EXERCISES_MESSAGE =
  'Não foi possível gerar um treino com as restrições e o equipamento informados.';

export const LLM_CALL_FAILED_MESSAGE =
  'A IA está indisponível no momento. Tente novamente em instantes.';

export const INCOMPLETE_ANSWERS_MESSAGE =
  'Verifique a resposta e tente novamente.';

export const PREMIUM_REQUIRED: ErrorMapping = {
  status: 403,
  code: 'premium_required',
  message: PREMIUM_REQUIRED_MESSAGE,
};

/** Same status/code/message the backend's own `assertRegenerateAllowed`
 * throws (ai-workout-prescription-b2b ADR-009). */
export const CONFIRM_OVERWRITE_REQUIRED: ErrorMapping = {
  status: 409,
  code: 'confirm_overwrite_required',
  message: CONFIRM_OVERWRITE_REQUIRED_MESSAGE,
};

export const NO_ELIGIBLE_EXERCISES: ErrorMapping = {
  status: 422,
  code: 'no_eligible_exercises',
  message: NO_ELIGIBLE_EXERCISES_MESSAGE,
};

export const LLM_CALL_FAILED: ErrorMapping = {
  status: 502,
  code: 'llm_call_failed',
  message: LLM_CALL_FAILED_MESSAGE,
};

export const INCOMPLETE_ANSWERS: ErrorMapping = {
  status: 400,
  code: 'incomplete_answers',
  message: INCOMPLETE_ANSWERS_MESSAGE,
};

export const WORKOUT_AI_GENERATION_ERRORS: ErrorMapping[] = [
  PREMIUM_REQUIRED,
  CONFIRM_OVERWRITE_REQUIRED,
  NO_ELIGIBLE_EXERCISES,
  LLM_CALL_FAILED,
  INCOMPLETE_ANSWERS,
  {
    status: 404,
    code: 'workout_not_found',
    message: WORKOUT_NOT_FOUND_MESSAGE,
  },
  { status: 404, code: 'student_not_found', message: STUDENT_GONE_MESSAGE },
  TOO_MANY_REQUESTS,
];
