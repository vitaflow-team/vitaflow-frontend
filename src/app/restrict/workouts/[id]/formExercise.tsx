'use client';

import { actionPatchWorkoutExercise } from '@/_actions/workouts/patchWorkoutExercise';
import { Button } from '@/_components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from '@/_components/ui/form';
import { Input } from '@/_components/ui/input';
import { useAlertHook } from '@/_hooks/alertHook';
import {
  updateWorkoutExerciseFormData,
  updateWorkoutExerciseSchema,
} from '@/_schema/exercise';
import type { Exercise } from '@/_types/exercise';
import type { WorkoutExercise } from '@/_types/workout';
import { zodResolverFixed } from '@/_lib/zodResolverHelper';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { useServerAction } from 'zsa-react';

interface FormExerciseProps {
  workoutExerciseId: string;
  current: WorkoutExercise;
  canRemove: boolean;
  candidates: Exercise[];
}

export default function FormExercise({
  workoutExerciseId,
  current,
  canRemove,
  candidates,
}: FormExerciseProps) {
  const methods = useForm<updateWorkoutExerciseFormData>({
    resolver: zodResolverFixed(updateWorkoutExerciseSchema),
    defaultValues: {
      workoutExerciseId,
      exerciseId: current.exercise?.id,
      sets: current.sets,
      reps: current.reps,
    },
  });
  const { isPending, execute } = useServerAction(actionPatchWorkoutExercise);
  const { isPending: isRemoving, execute: executeRemove } = useServerAction(
    actionPatchWorkoutExercise
  );
  const { openError } = useAlertHook();
  const router = useRouter();

  async function submit(data: updateWorkoutExerciseFormData) {
    const [, error] = await execute(data);
    if (error) {
      openError(error.message, 'Não foi possível salvar', 'error');
      return;
    }
    router.push('/restrict/workouts');
    router.refresh();
  }

  async function remove() {
    const [, error] = await executeRemove({
      workoutExerciseId,
      remove: true,
    });
    if (error) {
      openError(error.message, 'Não foi possível remover', 'error');
      return;
    }
    router.push('/restrict/workouts');
    router.refresh();
  }

  return (
    <Form {...methods}>
      <form
        onSubmit={methods.handleSubmit(submit)}
        className="flex flex-col w-full gap-4 p-1"
      >
        <FormField
          control={methods.control}
          name="exerciseId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Exercício</FormLabel>
              <FormControl>
                <select
                  id="exerciseId"
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  value={field.value}
                  onChange={event => field.onChange(event.target.value)}
                >
                  {current.exercise && (
                    <option value={current.exercise.id}>
                      {current.exercise.name} (atual)
                    </option>
                  )}
                  {candidates
                    .filter(candidate => candidate.id !== current.exercise?.id)
                    .map(candidate => (
                      <option key={candidate.id} value={candidate.id}>
                        {candidate.name}
                      </option>
                    ))}
                </select>
              </FormControl>
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={methods.control}
            name="sets"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Séries</FormLabel>
                <FormControl>
                  <Input id="sets" type="number" min={1} max={20} {...field} />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={methods.control}
            name="reps"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Repetições</FormLabel>
                <FormControl>
                  <Input id="reps" type="number" min={1} max={100} {...field} />
                </FormControl>
              </FormItem>
            )}
          />
        </div>

        <div className="flex gap-2 justify-end pt-2">
          {canRemove && (
            <Button
              type="button"
              variant="outline"
              disabled={isRemoving}
              onClick={remove}
            >
              Remover deste dia
            </Button>
          )}
          <Button type="submit" disabled={isPending}>
            Salvar
          </Button>
        </div>
      </form>
    </Form>
  );
}
