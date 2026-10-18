import type { ConversationTurn, Workout } from '@/_types/workout';
import { describe, expect, it } from 'vitest';
import {
  conversationReducer,
  eventForAdvance,
  INITIAL_CONVERSATION_STATE,
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

function advanceState(
  state: ConversationState,
  result: ConversationTurn | Workout | undefined,
  error: { message: string } | undefined,
  previousAnswer?: string
): ConversationState {
  const event = eventForAdvance(result, error, previousAnswer);
  return event.type === 'workout-ready'
    ? state
    : conversationReducer(state, event);
}

describe('eventForAdvance', () => {
  it('routes a Premium-gate error to premium-blocked, not load-failed', () => {
    const event = eventForAdvance(
      undefined,
      { message: 'Regeneração requer o plano Premium.' },
      undefined
    );

    expect(event).toEqual({ type: 'premium-blocked' });
  });

  it('UT-056 surfaces the specific AI-unavailable message as load-failed', () => {
    const event = eventForAdvance(
      undefined,
      {
        message:
          'A IA está indisponível no momento. Tente novamente em instantes.',
      },
      undefined
    );

    expect(event).toEqual({
      type: 'load-failed',
      message:
        'A IA está indisponível no momento. Tente novamente em instantes.',
    });
  });

  it('E2E-006 reports workout-ready once the intake completes', () => {
    const event = eventForAdvance(WORKOUT, undefined, undefined);

    expect(event).toEqual({ type: 'workout-ready', workout: WORKOUT });
  });

  it('carries the next question through on a normal turn', () => {
    const event = eventForAdvance(
      makeTurn({ field: 'goal', question: 'Qual é o seu objetivo?' }),
      undefined,
      'resposta anterior'
    );

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
    const optionalEvent = eventForAdvance(
      makeTurn({ optional: true }),
      undefined,
      undefined
    );
    const mandatoryEvent = eventForAdvance(
      makeTurn({ optional: false }),
      undefined,
      undefined
    );

    expect(optionalEvent).toMatchObject({ optional: true });
    expect(mandatoryEvent).toMatchObject({ optional: false });
  });
});

describe('conversationReducer', () => {
  it('UT-054 clears a stale reprompt when a later, unrelated error arrives', () => {
    const afterReprompt = advanceState(
      INITIAL_CONVERSATION_STATE,
      makeTurn({ reprompt: true, question: 'Quantos dias por semana?' }),
      undefined
    );
    expect(afterReprompt.reprompt).toBe(true);

    const afterError = advanceState(afterReprompt, undefined, {
      message:
        'A IA está indisponível no momento. Tente novamente em instantes.',
    });

    expect(afterError.reprompt).toBe(false);
    expect(afterError.loadError).toBe(
      'A IA está indisponível no momento. Tente novamente em instantes.'
    );
  });

  it('optional survives an error on the optional-field turn', () => {
    const onOptionalTurn = advanceState(
      INITIAL_CONVERSATION_STATE,
      makeTurn({
        field: 'restrictionDetail',
        question: 'Alguma restrição ou lesão?',
        optional: true,
      }),
      undefined
    );
    expect(onOptionalTurn.optional).toBe(true);

    const afterTransientFailure = advanceState(onOptionalTurn, undefined, {
      message:
        'A IA está indisponível no momento. Tente novamente em instantes.',
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
    const first = advanceState(
      INITIAL_CONVERSATION_STATE,
      makeTurn({ question: 'Qual é a sua idade?' }),
      undefined
    );

    const repromptedSameQuestion = advanceState(
      first,
      makeTurn({ question: 'Qual é a sua idade?', reprompt: true }),
      undefined,
      'abc'
    );
    expect(repromptedSameQuestion.history).toHaveLength(0);

    const next = advanceState(
      first,
      makeTurn({ question: 'Qual é o seu objetivo?' }),
      undefined,
      '30'
    );
    expect(next.history).toEqual([
      { question: 'Qual é a sua idade?', answer: '30' },
    ]);
  });
});
