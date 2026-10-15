import type { AcademiaEmployment } from '@/_types/academia';
import { RegisterStudentPanel } from './registerStudentPanel';

interface AcademiaAlunosEmptyStateProps {
  employments: AcademiaEmployment[];
}

export function AcademiaAlunosEmptyState({
  employments,
}: AcademiaAlunosEmptyStateProps) {
  return (
    <section
      aria-labelledby="academia-alunos-empty-title"
      className="flex flex-col items-center gap-3 rounded-lg border border-dashed border-line px-4 py-10 text-center"
    >
      <h2 id="academia-alunos-empty-title" className="text-lg font-semibold">
        Você ainda não tem alunos
      </h2>
      <p className="max-w-md text-sm text-muted-foreground">
        Cadastre o primeiro aluno da academia diretamente, ou aguarde um
        educador marcar um aluno dele como da academia.
      </p>
      <RegisterStudentPanel employments={employments} />
    </section>
  );
}
