import {
  isGeneratedWorkout,
  type ConversationOrWorkout,
  type Workout,
} from '@/_types/workout';

export interface AdvanceOutcome {
  premiumRequired: boolean;
  loadError?: string;
  generatedWorkout?: Workout;
  conversationId?: string;
  currentQuestion?: string;
  reprompt: boolean;
  optional: boolean;
}

/**
 * Decides what one advance() step changes about the chat's visible state,
 * given the server action's result/error pair. Every branch sets
 * `reprompt`/`optional` explicitly (never carries the previous turn's
 * value forward) — a stale "Não entendi" bubble from an earlier turn can
 * never survive into a later, unrelated error or question (ADR-008).
 */
export function deriveAdvanceOutcome(
  result: ConversationOrWorkout | undefined,
  error: { message: string } | undefined
): AdvanceOutcome {
  if (error) {
    const premiumRequired = error.message.includes('Premium');
    return {
      premiumRequired,
      loadError: premiumRequired ? undefined : error.message,
      reprompt: false,
      optional: false,
    };
  }
  if (!result) {
    return { premiumRequired: false, reprompt: false, optional: false };
  }
  if (isGeneratedWorkout(result)) {
    return {
      premiumRequired: false,
      reprompt: false,
      optional: false,
      generatedWorkout: result,
    };
  }
  return {
    premiumRequired: false,
    reprompt: result.reprompt,
    optional: result.optional,
    conversationId: result.conversationId,
    currentQuestion: result.question,
  };
}
