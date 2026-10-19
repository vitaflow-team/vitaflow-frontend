import {
  isGeneratedWorkout,
  type ConversationOrWorkout,
  type Workout,
} from '@/_types/workout';

export interface ConversationTurnRecord {
  question: string;
  answer?: string;
}

export interface ConversationState {
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

export type AdvanceEvent =
  | ConversationEvent
  | { type: 'workout-ready'; workout: Workout };

/**
 * Translates one server-action result/error pair into the event the
 * reducer (or, for `workout-ready`, the caller's own navigation) should act
 * on next.
 */
export function eventForAdvance(
  result: ConversationOrWorkout | undefined,
  error: { message: string } | undefined,
  previousAnswer: string | undefined
): AdvanceEvent {
  if (error) {
    return error.message.includes('Premium')
      ? { type: 'premium-blocked' }
      : { type: 'load-failed', message: error.message };
  }
  if (!result) {
    return { type: 'noop' };
  }
  if (isGeneratedWorkout(result)) {
    return { type: 'workout-ready', workout: result };
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
