import { buttonVariants } from '@/_components/ui/button';
import { WORKOUT_STATUS_LABELS } from '@/_constants/educatorWorkoutLimits';
import { workoutsHref } from '@/_lib/workoutLinks';
import type { WorkoutStatus } from '@/_types/educatorWorkouts';
import Link from 'next/link';

interface EditorHeaderProps {
  studentId: string;
  status: WorkoutStatus;
  isGone: boolean;
}

/** Back link, the workout status and the notice when it can no longer be saved. */
export function EditorHeader({ studentId, status, isGone }: EditorHeaderProps) {
  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <Link
          href={workoutsHref(studentId)}
          className={buttonVariants({ variant: 'ghost', size: 'sm' })}
        >
          ← Voltar para Treinos
        </Link>
        <p className="rounded-full border border-line px-2 py-0.5 text-xs font-medium">
          {WORKOUT_STATUS_LABELS[status]}
        </p>
      </div>
      {isGone && (
        <p
          role="alert"
          className="rounded-md border border-destructive/40 p-3 text-sm font-medium text-destructive"
        >
          Aluno ou treino não encontrado. O que você digitou continua na tela,
          mas não pode mais ser salvo.
        </p>
      )}
    </>
  );
}
