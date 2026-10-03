import type { StudentEducatorWorkout } from '@/_types/educatorWorkouts';
import { describe, expect, it } from 'vitest';
import { buildPlanOptions, planHref, selectPlan } from './studentPlans';

function educator(id: string, name: string): StudentEducatorWorkout {
  return {
    educator: { id, name },
    todaySessionId: null,
    workout: {
      id: `w-${id}`,
      title: 'T',
      weeklyFrequency: null,
      updatedAt: '2026-10-01T10:00:00.000Z',
      sessions: [],
    },
  };
}

describe('student plans', () => {
  it('UT-121 puts the educator workout first and the AI workout after it', () => {
    const options = buildPlanOptions([educator('e1', 'Thiago')], true);

    expect(options.map(option => option.key)).toEqual(['educador', 'ia']);
    expect(options.map(option => option.label)).toEqual([
      'Treino de Thiago',
      'Treino com IA',
    ]);
  });

  it('UT-125 gives every educator its own key and label', () => {
    const options = buildPlanOptions(
      [educator('e1', 'Thiago'), educator('e2', 'Marina')],
      false
    );

    expect(options.map(option => option.key)).toEqual([
      'educador',
      'educador-e2',
    ]);
    expect(options.map(option => option.label)).toEqual([
      'Treino de Thiago',
      'Treino de Marina',
    ]);
  });

  it('UT-122 has no option when there is neither plan', () => {
    expect(buildPlanOptions([], false)).toEqual([]);
    expect(selectPlan([], 'educador')).toBeNull();
  });

  it('selects what the address asks for, else the first plan', () => {
    const options = buildPlanOptions([educator('e1', 'Thiago')], true);

    expect(selectPlan(options, 'ia')?.key).toBe('ia');
    expect(selectPlan(options, 'educador')?.key).toBe('educador');
    expect(selectPlan(options, undefined)?.key).toBe('educador');
    expect(selectPlan(options, 'qualquer-coisa')?.key).toBe('educador');
    expect(selectPlan(options, ['ia', 'educador'])?.key).toBe('ia');
  });

  it('UT-128 builds the address the notification and the mirror link to', () => {
    expect(planHref('educador')).toBe('/restrict/workouts?plano=educador');
    expect(planHref('ia')).toBe('/restrict/workouts?plano=ia');
    expect(planHref('educador-a b')).toBe(
      '/restrict/workouts?plano=educador-a%20b'
    );
  });
});
