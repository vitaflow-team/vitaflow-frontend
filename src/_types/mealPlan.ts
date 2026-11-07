export type Weekday =
  | 'MONDAY'
  | 'TUESDAY'
  | 'WEDNESDAY'
  | 'THURSDAY'
  | 'FRIDAY'
  | 'SATURDAY'
  | 'SUNDAY';

export interface MealPlanMeal {
  id: string;
  label: string;
  text: string;
}

export interface MealPlanDay {
  id: string;
  weekday: Weekday;
  meals: MealPlanMeal[];
}

export interface MealPlanDraft {
  id: string;
  days: MealPlanDay[];
}

export interface MealPlanVersion {
  version: number;
  publishedAt: string;
}

/** `POST .../meal-plan/generation/conversation` returns the next intake
 * question, or, on the turn that completes the conversation, the freshly
 * generated draft — mirroring `ConversationOrWorkout` (`_types/workout.ts`)
 * for this feature (ADR-009). */
export interface MealPlanConversationTurn {
  conversationId: string;
  question: string;
  reprompt: boolean;
  optional: boolean;
}

/** The generated draft, as this feature's "ready" result — same shape as
 * the existing `MealPlanDraft` the rest of the screen already renders. */
export type MealPlanDraftResponseDTO = MealPlanDraft;

export type MealPlanConversationOrDraft =
  | MealPlanConversationTurn
  | MealPlanDraftResponseDTO;

/** Parameter typed against the generic `ConversationTurnLike` shape (not
 * `MealPlanConversationTurn` itself) so this guard satisfies the
 * generalized `ConversationChat`'s `isReady` prop (ADR-009), the same way
 * `isGeneratedWorkout` does for the workout flow. */
export function isMealPlanDraftResponse(
  result:
    | { conversationId: string; question: string }
    | MealPlanDraftResponseDTO
): result is MealPlanDraftResponseDTO {
  return 'days' in result;
}
