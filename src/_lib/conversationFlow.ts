export interface ConversationTurnRecord {
  question: string;
  answer?: string;
}

/**
 * Generic over the "ready" result (`TReady`) a feature's intake eventually
 * produces — a `Workout`, a `MealPlanDraftResponseDTO`, or any future
 * domain's equivalent (ADR-009). None of this state's own fields depend on
 * `TReady`: the reducer never stores a ready result, it only hands one back
 * to the caller via `AdvanceEvent`'s `'ready'` variant, so `TReady` defaults
 * to `unknown` and every instantiation is structurally interchangeable.
 */
// `TReady` is a deliberate phantom parameter here: no field below depends
// on it, it only keeps this interface's shape aligned with
// `AdvanceEvent<TReady>`'s (ADR-009).
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export interface ConversationState<TReady = unknown> {
  history: ConversationTurnRecord[];
  conversationId?: string;
  currentQuestion?: string;
  reprompt: boolean;
  optional: boolean;
  answer: string;
  premiumRequired: boolean;
  loadError?: string;
  /** Bumped on every `question-received` (reprompts included, even when
   * the question text repeats) and on `load-failed` — every transition
   * that leaves the answer input editable again after `isPending` disabled
   * it (browsers auto-blur a disabled input). The UI keys the input on
   * this so it remounts and reclaims focus each time. */
  turn: number;
}

export const INITIAL_CONVERSATION_STATE: ConversationState = {
  history: [],
  reprompt: false,
  optional: false,
  answer: '',
  premiumRequired: false,
  turn: 0,
};

/** The common shape of one intake turn, across every domain's own
 * conversation DTO (`ConversationTurn` for workouts, `MealPlanConversationTurn`
 * for meal plans, ...) — only the fields `conversationReducer` itself reads. */
export interface ConversationTurnLike {
  conversationId: string;
  question: string;
  reprompt: boolean;
  optional: boolean;
}

export type ConversationEvent =
  | { type: 'advance-started' }
  | { type: 'answer-changed'; value: string }
  | { type: 'noop' }
  | {
      type: 'question-received';
      conversationId: string;
      question: string;
      reprompt: boolean;
      optional: boolean;
      previousAnswer?: string;
    }
  | { type: 'premium-blocked' }
  | { type: 'load-failed'; message: string };

/**
 * Every branch owns only the fields its own transition changes — an error
 * never touches `optional`/`currentQuestion`, so a transient failure on the
 * optional restrictionDetail turn can't silently drop the "Pular" button
 * the way the previous flat-object version did (ADR-008 covers the sibling
 * `reprompt` case this mirrors).
 */
export function conversationReducer(
  state: ConversationState,
  event: ConversationEvent
): ConversationState {
  switch (event.type) {
    case 'advance-started':
      return { ...state, loadError: undefined, premiumRequired: false };
    case 'answer-changed':
      return { ...state, answer: event.value };
    case 'noop':
      return state;
    case 'question-received': {
      const history =
        !event.reprompt && state.currentQuestion
          ? [
              ...state.history,
              {
                question: state.currentQuestion,
                answer: event.previousAnswer,
              },
            ]
          : state.history;
      return {
        ...state,
        history,
        conversationId: event.conversationId,
        currentQuestion: event.question,
        reprompt: event.reprompt,
        optional: event.optional,
        answer: '',
        turn: state.turn + 1,
      };
    }
    case 'premium-blocked':
      return { ...state, premiumRequired: true };
    case 'load-failed':
      return {
        ...state,
        loadError: event.message,
        reprompt: false,
        turn: state.turn + 1,
      };
    default:
      return state;
  }
}

/** Replaces the old workout-specific `'workout-ready'`/`workout` variant
 * with a generic `'ready'` event carrying `TReady` (ADR-009) — the caller
 * (`ConversationChat`) intercepts this before it ever reaches the reducer,
 * exactly as it intercepted `'workout-ready'` before. */
export type AdvanceEvent<TReady = unknown> =
  | ConversationEvent
  | { type: 'ready'; result: TReady };

/**
 * Translates one server-action result/error pair into the event the
 * reducer (or, for `'ready'`, the caller's own on-ready callback) should act
 * on next. `isReady` is the caller's own type guard distinguishing a
 * finished "ready" result (`Workout`, `MealPlanDraftResponseDTO`, ...) from
 * a plain intake turn — each feature owns that distinction, the generic
 * flow here doesn't (ADR-009).
 *
 * Premium-gate detection checks the error's structured `code`
 * (`'premium_required'`) rather than matching a substring of the
 * human-readable `message` — the previous `message.includes('Premium')`
 * check was fragile: it only worked because the current Portuguese message
 * happened to contain that literal word.
 */
export interface EventForAdvanceInput<TReady> {
  result: ConversationTurnLike | TReady | undefined;
  error: { message: string; code?: string } | undefined;
  previousAnswer: string | undefined;
  isReady: (result: ConversationTurnLike | TReady) => result is TReady;
}

export function eventForAdvance<TReady>({
  result,
  error,
  previousAnswer,
  isReady,
}: EventForAdvanceInput<TReady>): AdvanceEvent<TReady> {
  if (error) {
    return error.code === 'premium_required'
      ? { type: 'premium-blocked' }
      : { type: 'load-failed', message: error.message };
  }
  if (!result) {
    return { type: 'noop' };
  }
  if (isReady(result)) {
    return { type: 'ready', result };
  }
  return {
    type: 'question-received',
    conversationId: result.conversationId,
    question: result.question,
    reprompt: result.reprompt,
    optional: result.optional,
    previousAnswer,
  };
}
