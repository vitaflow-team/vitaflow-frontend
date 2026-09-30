import { Button } from '@/_components/ui/button';
import { EXERCISE_ROUTES } from '@/_constants/exerciseCatalog';
import Link from 'next/link';

interface ExerciseLibraryHeaderProps {
  /** Physical educators can propose exercises (US-006). */
  canSubmit: boolean;
  /** Vita Flow staff reach catalog management from here. */
  canManage: boolean;
}

export function ExerciseLibraryHeader({
  canSubmit,
  canManage,
}: ExerciseLibraryHeaderProps) {
  return (
    <header className="border-primary flex flex-col gap-3 border-b pb-3 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-2xl font-semibold">Exercícios</h1>
        <p className="text-muted-foreground text-sm">
          Busque exercícios por nome, grupo muscular ou equipamento.
        </p>
      </div>
      <div className="flex flex-wrap gap-2">
        {canSubmit && (
          <Button asChild variant="outline">
            <Link href={EXERCISE_ROUTES.SUBMISSIONS}>Sugerir exercício</Link>
          </Button>
        )}
        {canManage && (
          <Button asChild variant="outline">
            <Link href={EXERCISE_ROUTES.BACKOFFICE}>Gerenciar catálogo</Link>
          </Button>
        )}
      </div>
    </header>
  );
}
