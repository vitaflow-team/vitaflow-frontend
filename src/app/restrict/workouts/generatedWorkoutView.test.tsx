import type { Workout } from '@/_types/workout';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';

// `ButtonLink` ("Gerar novo treino") calls `useRouter()` unconditionally —
// mocked the same way `conversationChat.test.tsx` mocks `next/navigation`.
vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn(), refresh: vi.fn() }),
}));

import { GeneratedWorkoutView } from './generatedWorkoutView';

const WORKOUT: Workout = {
  id: 'w1',
  goal: 'WEIGHT_LOSS',
  daysPerWeek: 3,
  explanation: 'Foco em déficit calórico.',
  days: [
    {
      id: 'd1',
      dayOfWeek: 1,
      exercises: [
        {
          id: 'e1',
          exercise: {
            id: 'ex1',
            name: 'Agachamento',
            muscleGroup: 'Pernas',
            videoUrl: null,
          },
          sets: 3,
          reps: 12,
          order: 0,
        },
      ],
    },
  ],
};

describe('GeneratedWorkoutView — pdf-export US-003', () => {
  it('UT-036 renders an Exportar PDF link when a current workout exists', () => {
    const html = renderToStaticMarkup(
      <GeneratedWorkoutView workout={WORKOUT} />
    );

    expect(html).toContain('href="/api/workouts/current/pdf"');
    expect(html).toContain('Exportar PDF');
  });

  // pdf-export UT-037/UT-040: this is the screen that renders instead of
  // the educator-workout mirror view whenever no `EducatorWorkout` exists
  // (including the backend's "academia-only unsupported" case) but an AI
  // workout does — it must never carry that other action's export link.
  it('never links to the EducatorWorkout export route', () => {
    const html = renderToStaticMarkup(
      <GeneratedWorkoutView workout={WORKOUT} />
    );

    expect(html).not.toContain('/api/me/educator-workouts/pdf');
  });
});
