import type { AcademiaEmployment } from '@/_types/academia';
import type { AcademiaAlunosList as AcademiaAlunosListType } from '@/_types/academiaAlunos';
import type { HorarioFilter } from '@/_lib/academiaAlunosList';
import { AcademiaAlunosEmptyState } from './academiaAlunosEmptyState';
import { AcademiaAlunosHorarioFilter } from './academiaAlunosHorarioFilter';
import { AcademiaAlunosList } from './academiaAlunosList';
import { AcademiaAlunosNoResults } from './academiaAlunosNoResults';
import { AcademiaAlunosPagination } from './academiaAlunosPagination';
import { AcademiaAlunosSearch } from './academiaAlunosSearch';
import { RegisterStudentPanel } from './registerStudentPanel';

interface AcademiaAlunosViewProps {
  list: AcademiaAlunosListType;
  employments: AcademiaEmployment[];
  search?: string;
  horario: HorarioFilter;
}

function AcademiaAlunosContent({
  list,
  employments,
  search,
  horario,
}: AcademiaAlunosViewProps) {
  if (list.total === 0) {
    return search || horario ? (
      <AcademiaAlunosNoResults search={search} horario={horario} />
    ) : (
      <AcademiaAlunosEmptyState employments={employments} />
    );
  }

  return (
    <>
      <AcademiaAlunosList items={list.items} employments={employments} />
      <AcademiaAlunosPagination
        search={search}
        horario={horario}
        page={list.page}
        total={list.total}
        pageSize={list.pageSize}
      />
    </>
  );
}

export function AcademiaAlunosView({
  list,
  employments,
  search,
  horario,
}: AcademiaAlunosViewProps) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-semibold">Alunos</h1>
        {list.total > 0 && <RegisterStudentPanel employments={employments} />}
      </div>
      <AcademiaAlunosSearch initialQuery={search ?? ''} horario={horario} />
      <AcademiaAlunosHorarioFilter search={search} horario={horario} />
      <AcademiaAlunosContent
        list={list}
        employments={employments}
        search={search}
        horario={horario}
      />
    </div>
  );
}
