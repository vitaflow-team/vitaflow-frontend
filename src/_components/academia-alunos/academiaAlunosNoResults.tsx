import { buttonVariants } from '@/_components/ui/button';
import {
  ACADEMIA_ALUNOS_PATH,
  type HorarioFilter,
} from '@/_lib/academiaAlunosList';
import Link from 'next/link';

interface AcademiaAlunosNoResultsProps {
  search?: string;
  horario: HorarioFilter;
}

export function AcademiaAlunosNoResults({
  search,
  horario,
}: AcademiaAlunosNoResultsProps) {
  const message = search
    ? `Nenhum aluno corresponde a “${search}”. Confira a grafia ou limpe a busca.`
    : horario === 'COM'
      ? 'Nenhum aluno com horário definido no momento.'
      : 'Nenhum aluno sem horário definido no momento.';

  return (
    <section
      aria-live="polite"
      className="flex flex-col items-center gap-3 px-4 py-10 text-center"
    >
      <p className="font-medium">Nenhum aluno encontrado</p>
      <p className="text-sm text-muted-foreground">{message}</p>
      <Link
        href={ACADEMIA_ALUNOS_PATH}
        className={buttonVariants({ variant: 'outline' })}
      >
        Limpar filtros
      </Link>
    </section>
  );
}
