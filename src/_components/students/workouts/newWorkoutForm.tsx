'use client';

import { createWorkout } from '@/_actions/students/workouts/createWorkout';
import { Button } from '@/_components/ui/button';
import { Input } from '@/_components/ui/input';
import { WORKOUT_TITLE_MAX } from '@/_constants/educatorWorkoutLimits';
import { workoutEditorHref } from '@/_lib/workoutLinks';
import { workoutTitleSchema } from '@/_schema/educatorWorkouts';
import { useRouter } from 'next/navigation';
import { useState, type FormEvent } from 'react';
import { useServerAction } from 'zsa-react';
import { FormError } from '../formError';

/** The title field of a new workout; on success the editor opens on the draft. */
export function NewWorkoutForm({ studentId }: { studentId: string }) {
  const router = useRouter();
  const action = useServerAction(createWorkout);
  const [title, setTitle] = useState('');
  const [error, setError] = useState<string | null>(null);

  async function submit(event: FormEvent) {
    event.preventDefault();
    if (action.isPending) return;
    setError(null);

    const parsed = workoutTitleSchema.safeParse(title);
    if (!parsed.success) return setError(parsed.error.issues[0].message);

    const [workout, failure] = await action.execute({
      studentId,
      title: parsed.data,
    });
    if (failure) return setError(failure.message);
    router.push(workoutEditorHref(studentId, workout.id));
  }

  return (
    <form className="flex flex-col gap-3" onSubmit={submit} noValidate>
      <label htmlFor="new-workout-title" className="text-sm font-medium">
        Título do treino
      </label>
      <Input
        id="new-workout-title"
        value={title}
        maxLength={WORKOUT_TITLE_MAX}
        autoComplete="off"
        aria-required="true"
        required
        onChange={event => setTitle(event.target.value)}
      />
      <FormError message={error} />
      <Button type="submit" disabled={action.isPending}>
        {action.isPending ? 'Criando…' : 'Criar treino'}
      </Button>
    </form>
  );
}
