import { isGeneratedWorkout } from '@/_types/workout';
import type { ConversationTurn, Workout } from '@/_types/workout';
import { describe, expect, it } from 'vitest';
import {
  conversationReducer,
  eventForAdvance,
  INITIAL_CONVERSATION_STATE,
  toAdvanceError,
  type ConversationState,
} from './conversationFlow';

function makeTurn(overrides: Partial<ConversationTurn> = {}): ConversationTurn {
  return {
    conversationId: 'conv-1',
    field: 'sex',
    question: 'Qual é o seu sexo?',
    done: false,
    reprompt: false,
    optional: false,
    ...overrides,
  };
}

const WORKOUT: Workout = {
  id: 'workout-1',
  goal: 'MUSCLE_GAIN',
  daysPerWeek: 3,
  explanation: 'Plano.',
  days: [],
};

interface AdvanceStateInput {
  result: ConversationTurn | Workout | undefined;
  error: { message: string; code?: string } | undefined;
  previousAnswer?: string;
}

function advanceState(
  state: ConversationState,
  { result, error, previousAnswer }: AdvanceStateInput
): ConversationState {
  const event = eventForAdvance({
    result,
    error,
    previousAnswer,
    isReady: isGeneratedWorkout,
  });
  return event.type === 'ready' ? state : conversationReducer(state, event);
}

describe('toAdvanceError', () => {
  it("ADR-009 reads the app code from `data`, which is distinct from zsa's own top-level `code` (always `'ERROR'`, never read here)", () => {
    expect(
      toAdvanceError({
        message: 'Regeneração requer o plano Premium.',
        data: 'premium_required',
      })
    ).toEqual({
      message: 'Regeneração requer o plano Premium.',
      code: 'premium_required',
    });
  });

  it('leaves `code` undefined when `data` carries no app code', () => {
    expect(
      toAdvanceError({ message: 'Erro genérico.', data: undefined })
    ).toEqual({ message: 'Erro genérico.', code: undefined });
  });

  it('passes undefined through for no error', () => {
    expect(toAdvanceError(undefined)).toBeUndefined();
    expect(toAdvanceError(null)).toBeUndefined();
  });
});

describe('eventForAdvance', () => {
  it('routes a Premium-gate error to premium-blocked, not load-failed', () => {
    const event = eventForAdvance({
      result: undefined,
      error: {
        message: 'Regeneração requer o plano Premium.',
        code: 'premium_required',
      },
      previousAnswer: undefined,
      isReady: isGeneratedWorkout,
    });

    expect(event).toEqual({ type: 'premium-blocked' });
  });

  it('UT-027 (boundary) detects a premium-gate error by its structured code, not a message substring — the fix proving the old "Premium"-text match is gone', () => {
    const event = eventForAdvance({
      result: undefined,
      error: {
        // Deliberately does NOT contain the word "Premium" — the old
        // `message.includes('Premium')` check would have routed this to
        // `load-failed` instead.
        message: 'Limite do plano atingido.',
        code: 'premium_required',
      },
      previousAnswer: undefined,
      isReady: isGeneratedWorkout,
    });

    expect(event).toEqual({ type: 'premium-blocked' });
  });

  it('UT-056 surfaces the specific AI-unavailable message as load-failed', () => {
    const event = eventForAdvance({
      result: undefined,
      error: {
        message:
          'A IA está indisponível no momento. Tente novamente em instantes.',
      },
      previousAnswer: undefined,
      isReady: isGeneratedWorkout,
    });

    expect(event).toEqual({
      type: 'load-failed',
      message:
        'A IA está indisponível no momento. Tente novamente em instantes.',
    });
  });

  it('E2E-006 reports a ready event once the intake completes', () => {
    const event = eventForAdvance({
      result: WORKOUT,
      error: undefined,
      previousAnswer: undefined,
      isReady: isGeneratedWorkout,
    });

    expect(event).toEqual({ type: 'ready', result: WORKOUT });
  });

  it('carries the next question through on a normal turn', () => {
    const event = eventForAdvance({
      result: makeTurn({ field: 'goal', question: 'Qual é o seu objetivo?' }),
      error: undefined,
      previousAnswer: 'resposta anterior',
      isReady: isGeneratedWorkout,
    });

    expect(event).toEqual({
      type: 'question-received',
      conversationId: 'conv-1',
      question: 'Qual é o seu objetivo?',
      reprompt: false,
      optional: false,
      previousAnswer: 'resposta anterior',
    });
  });

  it('UT-055 reports optional:true only for the turn that carries it', () => {
    const optionalEvent = eventForAdvance({
      result: makeTurn({ optional: true }),
      error: undefined,
      previousAnswer: undefined,
      isReady: isGeneratedWorkout,
    });
    const mandatoryEvent = eventForAdvance({
      result: makeTurn({ optional: false }),
      error: undefined,
      previousAnswer: undefined,
      isReady: isGeneratedWorkout,
    });

    expect(optionalEvent).toMatchObject({ optional: true });
    expect(mandatoryEvent).toMatchObject({ optional: false });
  });
});

describe('conversationReducer', () => {
  it('UT-054 clears a stale reprompt when a later, unrelated error arrives', () => {
    const afterReprompt = advanceState(INITIAL_CONVERSATION_STATE, {
      result: makeTurn({
        reprompt: true,
        question: 'Quantos dias por semana?',
      }),
      error: undefined,
    });
    expect(afterReprompt.reprompt).toBe(true);

    const afterError = advanceState(afterReprompt, {
      result: undefined,
      error: {
        message:
          'A IA está indisponível no momento. Tente novamente em instantes.',
      },
    });

    expect(afterError.reprompt).toBe(false);
    expect(afterError.loadError).toBe(
      'A IA está indisponível no momento. Tente novamente em instantes.'
    );
  });

  it('optional survives an error on the optional-field turn', () => {
    const onOptionalTurn = advanceState(INITIAL_CONVERSATION_STATE, {
      result: makeTurn({
        field: 'restrictionDetail',
        question: 'Alguma restrição ou lesão?',
        optional: true,
      }),
      error: undefined,
    });
    expect(onOptionalTurn.optional).toBe(true);

    const afterTransientFailure = advanceState(onOptionalTurn, {
      result: undefined,
      error: {
        message:
          'A IA está indisponível no momento. Tente novamente em instantes.',
      },
    });

    expect(afterTransientFailure.optional).toBe(true);
    expect(afterTransientFailure.currentQuestion).toBe(
      'Alguma restrição ou lesão?'
    );
    expect(afterTransientFailure.loadError).toBe(
      'A IA está indisponível no momento. Tente novamente em instantes.'
    );
  });

  it('clears a stale premiumRequired when a fresh attempt starts', () => {
    const blocked = conversationReducer(INITIAL_CONVERSATION_STATE, {
      type: 'premium-blocked',
    });
    expect(blocked.premiumRequired).toBe(true);

    const restarted = conversationReducer(blocked, {
      type: 'advance-started',
    });
    expect(restarted.premiumRequired).toBe(false);
  });

  it('appends the previous question/answer to history on a normal turn, but not on a reprompt', () => {
    const first = advanceState(INITIAL_CONVERSATION_STATE, {
      result: makeTurn({ question: 'Qual é a sua idade?' }),
      error: undefined,
    });

    const repromptedSameQuestion = advanceState(first, {
      result: makeTurn({ question: 'Qual é a sua idade?', reprompt: true }),
      error: undefined,
      previousAnswer: 'abc',
    });
    expect(repromptedSameQuestion.history).toHaveLength(0);

    const next = advanceState(first, {
      result: makeTurn({ question: 'Qual é o seu objetivo?' }),
      error: undefined,
      previousAnswer: '30',
    });
    expect(next.history).toEqual([
      { question: 'Qual é a sua idade?', answer: '30' },
    ]);
  });

  it('UT-028 (state) bumps turn on every question-received, even a reprompt repeating the same question', () => {
    expect(INITIAL_CONVERSATION_STATE.turn).toBe(0);

    const first = advanceState(INITIAL_CONVERSATION_STATE, {
      result: makeTurn({ question: 'Qual é a sua idade?' }),
      error: undefined,
    });
    expect(first.turn).toBe(1);

    const repromptedSameQuestion = advanceState(first, {
      result: makeTurn({ question: 'Qual é a sua idade?', reprompt: true }),
      error: undefined,
    });
    expect(repromptedSameQuestion.turn).toBe(2);
  });

  it('UT-028 (state) bumps turn on load-failed too, so the input reclaims focus after a failed retry', () => {
    const onQuestion = advanceState(INITIAL_CONVERSATION_STATE, {
      result: makeTurn({ question: 'Quantos minutos você tem disponível?' }),
      error: undefined,
    });
    expect(onQuestion.turn).toBe(1);

    const afterTransientFailure = advanceState(onQuestion, {
      result: undefined,
      error: {
        message:
          'A IA está indisponível no momento. Tente novamente em instantes.',
      },
    });
    expect(afterTransientFailure.turn).toBe(2);
    expect(afterTransientFailure.currentQuestion).toBe(
      'Quantos minutos você tem disponível?'
    );
  });
});

// Generic-shape coverage (ADR-009): proves `conversationReducer`/
// `eventForAdvance` work for *any* `TReady`, not just `Workout` — a stub
// type/guard unrelated to any real domain.
interface StubReady {
  stubId: string;
}

function isStubReady(
  result: { conversationId: string } | StubReady
): result is StubReady {
  return 'stubId' in result;
}

describe('conversationReducer (generic TReady)', () => {
  it('UT-025 (happy) question-received updates currentQuestion/conversationId/reprompt/optional and bumps turn, generically', () => {
    const event = eventForAdvance<StubReady>({
      result: {
        conversationId: 'conv-stub',
        question: 'Stub question?',
        reprompt: false,
        optional: true,
      },
      error: undefined,
      previousAnswer: undefined,
      isReady: isStubReady,
    });
    if (event.type === 'ready') throw new Error('expected a question turn');
    const next = conversationReducer(INITIAL_CONVERSATION_STATE, event);

    expect(next.currentQuestion).toBe('Stub question?');
    expect(next.conversationId).toBe('conv-stub');
    expect(next.reprompt).toBe(false);
    expect(next.optional).toBe(true);
    expect(next.turn).toBe(1);
  });
});

describe('eventForAdvance (generic TReady)', () => {
  it('UT-026 (happy) dispatching a ready event with a stub TReady payload carries that payload through unchanged', () => {
    const stub: StubReady = { stubId: 'stub-1' };
    const event = eventForAdvance<StubReady>({
      result: stub,
      error: undefined,
      previousAnswer: undefined,
      isReady: isStubReady,
    });

    expect(event).toEqual({ type: 'ready', result: stub });
  });
});
