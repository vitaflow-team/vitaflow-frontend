import type { WorkoutTree } from './educatorWorkouts';

/** One in-progress intake turn, adapted to the shape the shared,
 * generic `ConversationChat` component requires (`ConversationTurnLike`)
 * — the same adaptation `MealPlanConversationTurn` makes for meal plans.
 * None of this feature's 5 fields are skippable, so `optional` is always
 * `false`; the Server Action sets it, since the backend's own turn shape
 * has no such concept. */
export interface EducatorAiWorkoutConversationTurn {
  conversationId: string;
  question: string;
  reprompt: boolean;
  optional: boolean;
}

export type EducatorAiWorkoutConversationOrTree =
  | EducatorAiWorkoutConversationTurn
  | WorkoutTree;

/**
 * Distinguishes the generated `WorkoutTree` from an in-progress turn. Unlike
 * the two existing precedents (meal plan, B2C workout generator), which both
 * discriminate on a `days` array, this feature's final result is a
 * `WorkoutTree`, which has `sessions` instead.
 */
export function isGeneratedWorkoutTree(
  result: { conversationId: string; question: string } | WorkoutTree
): result is WorkoutTree {
  return 'sessions' in result;
}
