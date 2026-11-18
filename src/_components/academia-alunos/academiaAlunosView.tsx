import type { AcademiaEmployment } from '@/_types/academia';
import type { AcademiaAlunosList as AcademiaAlunosListType } from '@/_types/academiaAlunos';
import type { GymBillingAvailability } from '@/_types/gymBillingAvailability';
import type { HorarioFilter } from '@/_lib/academiaAlunosList';
import { AcademiaAlunosEmptyState } from './academiaAlunosEmptyState';
import { AcademiaAlunosHorarioFilter } from './academiaAlunosHorarioFilter';
import { AcademiaAlunosList } from './academiaAlunosList';
import { AcademiaAlunosNoResults } from './academiaAlunosNoResults';
import { AcademiaAlunosPagination } from './academiaAlunosPagination';
import { AcademiaAlunosSearch } from './academiaAlunosSearch';
import { BulkActivationEntry } from './bulkActivationEntry';
import { RegisterStudentPanel } from './registerStudentPanel';

interface AcademiaAlunosViewProps {
  list: AcademiaAlunosListType;
  employments: AcademiaEmployment[];
  billing: GymBillingAvailability;
  search?: string;
  horario: HorarioFilter;
}

function AcademiaAlunosContent({
  list,
  employments,
  billing,
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
      <AcademiaAlunosList
        items={list.items}
        employments={employments}
        billing={billing}
      />
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
  billing,
  search,
  horario,
}: AcademiaAlunosViewProps) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-semibold">Alunos</h1>
        {list.total > 0 && (
          <div className="flex flex-wrap gap-2">
            <BulkActivationEntry billing={billing} />
            <RegisterStudentPanel employments={employments} />
          </div>
        )}
      </div>
      <AcademiaAlunosSearch initialQuery={search ?? ''} horario={horario} />
      <AcademiaAlunosHorarioFilter search={search} horario={horario} />
      <AcademiaAlunosContent
        list={list}
        employments={employments}
        billing={billing}
        search={search}
        horario={horario}
      />
    </div>
  );
}
