import type { ConversationTurn, Workout } from '@/_types/workout';
import { describe, expect, it } from 'vitest';
import { deriveAdvanceOutcome } from './conversationAdvance';

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

describe('deriveAdvanceOutcome', () => {
  it('UT-054 clears a stale reprompt when a later, unrelated error arrives', () => {
    const afterReprompt = deriveAdvanceOutcome(
      makeTurn({ reprompt: true, question: 'Quantos dias por semana?' }),
      undefined
    );
    expect(afterReprompt.reprompt).toBe(true);

    const afterError = deriveAdvanceOutcome(undefined, {
      message:
        'A IA está indisponível no momento. Tente novamente em instantes.',
    });

    expect(afterError.reprompt).toBe(false);
    expect(afterError.loadError).toBe(
      'A IA está indisponível no momento. Tente novamente em instantes.'
    );
  });

  it('UT-055 reports optional:true only for the turn that carries it', () => {
    expect(
      deriveAdvanceOutcome(makeTurn({ optional: true }), undefined).optional
    ).toBe(true);
    expect(
      deriveAdvanceOutcome(makeTurn({ optional: false }), undefined).optional
    ).toBe(false);
  });

  it('UT-056 surfaces the specific AI-unavailable message as loadError, not a Premium redirect', () => {
    const outcome = deriveAdvanceOutcome(undefined, {
      message:
        'A IA está indisponível no momento. Tente novamente em instantes.',
    });

    expect(outcome.premiumRequired).toBe(false);
    expect(outcome.loadError).toBe(
      'A IA está indisponível no momento. Tente novamente em instantes.'
    );
  });

  it('routes a Premium-gate error to premiumRequired, not loadError', () => {
    const outcome = deriveAdvanceOutcome(undefined, {
      message: 'Regeneração requer o plano Premium.',
    });

    expect(outcome.premiumRequired).toBe(true);
    expect(outcome.loadError).toBeUndefined();
    expect(outcome.reprompt).toBe(false);
  });

  it('carries the next question through on a normal turn', () => {
    const outcome = deriveAdvanceOutcome(
      makeTurn({ field: 'goal', question: 'Qual é o seu objetivo?' }),
      undefined
    );

    expect(outcome.currentQuestion).toBe('Qual é o seu objetivo?');
    expect(outcome.conversationId).toBe('conv-1');
    expect(outcome.generatedWorkout).toBeUndefined();
  });

  it('E2E-006 reports the generated workout once the intake completes', () => {
    const outcome = deriveAdvanceOutcome(WORKOUT, undefined);

    expect(outcome.generatedWorkout).toBe(WORKOUT);
    expect(outcome.reprompt).toBe(false);
    expect(outcome.optional).toBe(false);
  });
});
