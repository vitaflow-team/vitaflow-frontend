'use client';

import { deleteExercise } from '@/_actions/exercises/deleteExercise';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/_components/ui/alert-dialog';
import { Button } from '@/_components/ui/button';
import { useExerciseMutation } from '@/_hooks/useExerciseMutation';

interface RemoveExerciseButtonProps {
  exerciseId: string;
  exerciseName: string;
}

/** Removes an exercise from the catalog after a confirmation (US-010.AC-3). */
export function RemoveExerciseButton({
  exerciseId,
  exerciseName,
}: RemoveExerciseButtonProps) {
  const { run, isPending } = useExerciseMutation();

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="outline" size="sm" disabled={isPending}>
          Remover
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Remover “{exerciseName}”?</AlertDialogTitle>
          <AlertDialogDescription>
            O exercício sai do catálogo para todos os usuários. Esta ação não
            pode ser desfeita.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            onClick={() =>
              run(
                () => deleteExercise({ id: exerciseId }),
                'Exercício removido do catálogo.'
              )
            }
            className="bg-destructive hover:bg-destructive/90 text-white"
          >
            Remover
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
