import type { StudentList } from '@/_types/students';
import { AddStudentPanel } from './addStudentPanel';
import { StudentSearch } from './studentSearch';
import { StudentsOrderControl } from './studentsOrderControl';
import { StudentsEmptyState } from './studentsEmptyState';
import { StudentsList } from './studentsList';
import { StudentsNoResults } from './studentsNoResults';
import { StudentsPagination } from './studentsPagination';

interface StudentsViewProps {
  list: StudentList;
  search?: string;
  order?: 'name';
}

function StudentsContent({ list, search, order }: StudentsViewProps) {
  if (list.total === 0) {
    return search ? (
      <StudentsNoResults search={search} />
    ) : (
      <StudentsEmptyState />
    );
  }

  return (
    <>
      <StudentsList students={list.items} />
      <StudentsPagination
        search={search}
        order={order}
        page={list.page}
        total={list.total}
        pageSize={list.pageSize}
      />
    </>
  );
}

/** The educator's student list: header, add action, search and the right state. */
export function StudentsView({ list, search, order }: StudentsViewProps) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-semibold">Alunos</h1>
        <AddStudentPanel />
      </div>
      <StudentSearch initialQuery={search ?? ''} />
      <StudentsOrderControl order={order} search={search} />
      <StudentsContent list={list} search={search} order={order} />
    </div>
  );
}
