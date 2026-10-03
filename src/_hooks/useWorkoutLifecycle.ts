'use client';

import { activateWorkout } from '@/_actions/students/workouts/activateWorkout';
import { deactivateWorkout } from '@/_actions/students/workouts/deactivateWorkout';
import { deleteWorkout } from '@/_actions/students/workouts/deleteWorkout';
import { workoutsHref } from '@/_lib/workoutLinks';
import type { ActivationProblem, WorkoutTree } from '@/_types/educatorWorkouts';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useServerAction } from 'zsa-react';

const NOT_FOUND_MESSAGE =
  'Este treino não existe mais. Volte para a lista de treinos.';

interface Feedback {
  error: string | null;
  problems: ActivationProblem[];
}

const NO_FEEDBACK: Feedback = { error: null, problems: [] };

/**
 * Activate, deactivate and delete for one workout. A refusal to activate keeps
 * the displayed state and names the sessions without exercises; a failure
 * keeps the state as it was and shows the reason.
 */
export function useWorkoutLifecycle(
  studentId: string,
  workoutId: string,
  onChanged: (tree: WorkoutTree) => void
) {
  const router = useRouter();
  const activate = useServerAction(activateWorkout);
  const deactivate = useServerAction(deactivateWorkout);
  const remove = useServerAction(deleteWorkout);
  const [feedback, setFeedback] = useState<Feedback>(NO_FEEDBACK);
  const setError = (error: string) => setFeedback({ error, problems: [] });
  const input = { studentId, workoutId };
  const isPending = [activate, deactivate, remove].some(a => a.isPending);

  async function runActivate() {
    if (isPending) return;
    setFeedback(NO_FEEDBACK);
    const [result, failure] = await activate.execute(input);
    if (failure) return setError(failure.message);

    if (result.outcome === 'activated') onChanged(result.workout);
    else if (result.outcome === 'not_activatable') {
      setFeedback({ error: null, problems: result.problems });
    } else setError(NOT_FOUND_MESSAGE);
  }

  async function runDeactivate() {
    if (isPending) return;
    setFeedback(NO_FEEDBACK);
    const [tree, failure] = await deactivate.execute(input);
    if (failure) setError(failure.message);
    else onChanged(tree);
  }

  async function runRemove() {
    if (isPending) return;
    setFeedback(NO_FEEDBACK);
    const [, failure] = await remove.execute(input);
    if (failure) return setError(failure.message);

    router.push(workoutsHref(studentId));
    router.refresh();
  }

  return { isPending, ...feedback, runActivate, runDeactivate, runRemove };
}
