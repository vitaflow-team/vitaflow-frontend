'use client';

import { duplicateWorkout } from '@/_actions/students/workouts/duplicateWorkout';
import { canDuplicate } from '@/_lib/duplicateSelection';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useServerAction } from 'zsa-react';

/**
 * The students picked for the copies and the request that creates them. A
 * failure keeps the selection and shows the reason; a success reports how many
 * copies were made and clears the selection.
 */
export function useDuplicateWorkout(studentId: string, workoutId: string) {
  const router = useRouter();
  const action = useServerAction(duplicateWorkout);
  const [selected, setSelected] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState<number | null>(null);

  async function submit() {
    if (action.isPending || !canDuplicate(selected)) return;
    setError(null);

    const [result, failure] = await action.execute({
      studentId,
      workoutId,
      studentIds: selected,
    });
    if (failure) return setError(failure.message);
    setDone(result.copies.length);
    setSelected([]);
    router.refresh();
  }

  return {
    selected,
    setSelected,
    error,
    done,
    isPending: action.isPending,
    canSubmit: canDuplicate(selected),
    submit,
  };
}
