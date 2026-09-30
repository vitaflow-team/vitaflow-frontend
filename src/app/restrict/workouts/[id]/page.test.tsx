import type { ReactNode } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const { authMock, loadCurrentWorkoutMock, loadExercisesMock } = vi.hoisted(
  () => ({
    authMock: vi.fn(),
    loadCurrentWorkoutMock: vi.fn(),
    loadExercisesMock: vi.fn(),
  })
);

vi.mock('@/auth', () => ({ auth: authMock }));
vi.mock('@/_lib/workoutData', () => ({
  loadCurrentWorkout: loadCurrentWorkoutMock,
  isLoadFailure: (result: unknown) => typeof result === 'string',
}));
vi.mock('@/_lib/exerciseCatalog', () => ({
  loadExercises: loadExercisesMock,
  isLoadFailure: (result: unknown) => typeof result === 'string',
}));
vi.mock('@/_components/layout/defaultLayout', () => ({
  default: ({ children }: { children: ReactNode }) => <>{children}</>,
}));
vi.mock('./formWorkout', () => ({
  default: (props: { workoutExerciseId: string; canRemove: boolean }) => (
    <i
      data-testid="form-workout"
      data-workout-exercise-id={props.workoutExerciseId}
      data-can-remove={String(props.canRemove)}
    />
  ),
}));

import WorkoutExerciseEditPage from './page';

const WORKOUT = {
  id: 'workout-1',
  goal: 'MUSCLE_GAIN',
  daysPerWeek: 1,
  explanation: 'x',
  days: [
    {
      id: 'day-1',
      dayOfWeek: 1,
      exercises: [
        {
          id: 'we-1',
          exercise: { id: 'ex-1', name: 'A', muscleGroup: 'x', videoUrl: null },
          sets: 3,
          reps: 10,
          order: 1,
        },
        {
          id: 'we-2',
          exercise: { id: 'ex-2', name: 'B', muscleGroup: 'x', videoUrl: null },
          sets: 3,
          reps: 10,
          order: 2,
        },
      ],
    },
  ],
};

beforeEach(() => {
  vi.clearAllMocks();
  authMock.mockResolvedValue({ user: { id: 'user-1' } });
  loadExercisesMock.mockResolvedValue([]);
});

describe('WorkoutExerciseEditPage', () => {
  it('renders nothing without a session', async () => {
    authMock.mockResolvedValue(null);

    const page = await WorkoutExerciseEditPage({
      params: Promise.resolve({ id: 'we-1' }),
    });
    expect(page).toBeNull();
  });

  it('passes the matched exercise and canRemove=true when siblings remain', async () => {
    loadCurrentWorkoutMock.mockResolvedValue(WORKOUT);

    const page = await WorkoutExerciseEditPage({
      params: Promise.resolve({ id: 'we-1' }),
    });
    const markup = renderToStaticMarkup(page);

    expect(markup).toContain('data-workout-exercise-id="we-1"');
    expect(markup).toContain('data-can-remove="true"');
  });
});
