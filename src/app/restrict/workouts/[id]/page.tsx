import DefaultLayout from '@/_components/layout/defaultLayout';
import { PAGE_TITLES } from '@/_constants/pageTitles';
import { isLoadFailure, loadExercises } from '@/_lib/exerciseCatalog';
import {
  isLoadFailure as isWorkoutLoadFailure,
  loadCurrentWorkout,
} from '@/_lib/workoutData';
import { auth } from '@/auth';
import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import FormWorkout from './formWorkout';

export const metadata: Metadata = {
  title: PAGE_TITLES.workoutForm,
};

// `id` is the `WorkoutExercise` id being edited — a generated workout has
// no separate "workout id" concept of its own (one current workout per
// user, no history, per this PRD's Non-Goals).
export default async function WorkoutExerciseEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth();
  if (!session?.user) return null;

  const { id: workoutExerciseId } = await params;

  const [workout, candidates] = await Promise.all([
    loadCurrentWorkout(),
    loadExercises({ page: 1 }),
  ]);

  if (!workout || isWorkoutLoadFailure(workout)) {
    redirect('/restrict/workouts');
  }

  const day = workout.days.find(d =>
    d.exercises.some(exercise => exercise.id === workoutExerciseId)
  );
  const current = day?.exercises.find(
    exercise => exercise.id === workoutExerciseId
  );

  if (!day || !current) {
    redirect('/restrict/workouts');
  }

  return (
    <DefaultLayout>
      <FormWorkout
        workoutExerciseId={workoutExerciseId}
        dayOfWeek={day.dayOfWeek}
        current={current}
        canRemove={day.exercises.length > 1}
        candidates={isLoadFailure(candidates) ? [] : candidates}
      />
    </DefaultLayout>
  );
}
