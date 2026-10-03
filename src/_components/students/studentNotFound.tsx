import { buttonVariants } from '@/_components/ui/button';
import { STUDENTS_PATH } from '@/_lib/studentsList';
import type { LoadFailure } from '@/_types/loadFailure';
import Link from 'next/link';

interface StudentNotFoundProps {
  reason: LoadFailure;
}

/**
 * An unknown, foreign, malformed or removed id all read the same, so the page
 * never confirms that an id belongs to someone else.
 */
export function StudentNotFound({ reason }: StudentNotFoundProps) {
  const failed = reason === 'failed';

  return (
    <section
      aria-labelledby="student-not-found-title"
      className="flex flex-col items-center gap-3 px-4 py-12 text-center"
    >
      <h1 id="student-not-found-title" className="text-xl font-semibold">
        {failed ? 'Não foi possível carregar o aluno' : 'Aluno não encontrado'}
      </h1>
      <p className="max-w-md text-sm text-muted-foreground">
        {failed
          ? 'Tente novamente em alguns instantes.'
          : 'Este aluno não existe ou foi removido da sua lista.'}
      </p>
      <Link
        href={STUDENTS_PATH}
        className={buttonVariants({ variant: 'outline' })}
      >
        Voltar para Alunos
      </Link>
    </section>
  );
}
