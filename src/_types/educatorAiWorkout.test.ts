import { describe, expect, it } from 'vitest';
import { isGeneratedWorkoutTree } from './educatorAiWorkout';

describe('isGeneratedWorkoutTree', () => {
  // UT-022
  it('returns false for an in-progress conversation turn', () => {
    expect(
      isGeneratedWorkoutTree({
        conversationId: 'conv-1',
        question: 'Qual o objetivo do aluno?',
      })
    ).toBe(false);
  });

  it('returns true for a completed workout tree', () => {
    expect(
      isGeneratedWorkoutTree({
        id: 'w1',
        title: 'Treino gerado por IA',
        status: 'DRAFT',
        weeklyFrequency: 3,
        updatedAt: new Date().toISOString(),
        sessions: [],
      })
    ).toBe(true);
  });
});
