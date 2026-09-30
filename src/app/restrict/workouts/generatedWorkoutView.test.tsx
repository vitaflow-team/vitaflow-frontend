import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';
import type { Workout } from '@/_types/workout';

vi.mock('@/_components/ui/buttonLink', () => ({
  ButtonLink: ({ label, url }: { label: string; url: string }) => (
    <a href={url}>{label}</a>
  ),
}));

import { GeneratedWorkoutView } from './generatedWorkoutView';

const WORKOUT: Workout = {
  id: 'workout-1',
  goal: 'MUSCLE_GAIN',
  daysPerWeek: 1,
  explanation: 'Plano focado em ganho de massa.',
  days: [
    {
      id: 'day-1',
      dayOfWeek: 1,
      exercises: [
        {
          id: 'we-1',
          exercise: {
            id: 'ex-1',
            name: 'Supino',
            muscleGroup: 'Peito',
            videoUrl: null,
          },
          sets: 3,
          reps: 10,
          order: 1,
        },
        {
          id: 'we-2',
          exercise: null,
          sets: 3,
          reps: 12,
          order: 2,
        },
      ],
    },
  ],
};

describe('GeneratedWorkoutView', () => {
  it('renders every day, exercise and the explanation text', () => {
    const markup = renderToStaticMarkup(
      <GeneratedWorkoutView workout={WORKOUT} />
    );

    expect(markup).toContain('Plano focado em ganho de massa.');
    expect(markup).toContain('Supino');
    expect(markup).toContain('3x10');
  });

  it('shows removed exercises as unavailable instead of failing (UT-019)', () => {
    const markup = renderToStaticMarkup(
      <GeneratedWorkoutView workout={WORKOUT} />
    );

    expect(markup).toContain('Exercício indisponível');
  });

  it('always shows the safety disclaimer', () => {
    const markup = renderToStaticMarkup(
      <GeneratedWorkoutView workout={WORKOUT} />
    );

    expect(markup).toContain('não substitui a avaliação de');
  });

  it('offers a link to generate a new workout', () => {
    const markup = renderToStaticMarkup(
      <GeneratedWorkoutView workout={WORKOUT} />
    );

    expect(markup).toContain('Gerar novo treino');
  });
});
