import type { EducatorEmployment } from '@/_types/educatorEmployment';
import type { StudentList } from '@/_types/students';
import { AddStudentPanel } from './addStudentPanel';
import { PendingFilterControl } from './pendingFilterControl';
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
  pending?: boolean;
  isPremium?: boolean;
  employments?: EducatorEmployment[];
}

function StudentsContent({ list, search, order, pending }: StudentsViewProps) {
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
        pending={pending}
        page={list.page}
        total={list.total}
        pageSize={list.pageSize}
      />
    </>
  );
}

/** The educator's student list: header, add action, search and the right state. */
export function StudentsView({
  list,
  search,
  order,
  pending,
  isPremium,
  employments = [],
}: StudentsViewProps) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-semibold">Alunos</h1>
        <AddStudentPanel employments={employments} />
      </div>
      <StudentSearch initialQuery={search ?? ''} />
      <div className="flex flex-wrap gap-2">
        <StudentsOrderControl order={order} search={search} />
        {isPremium && (
          <PendingFilterControl
            pending={pending}
            search={search}
            order={order}
          />
        )}
      </div>
      <StudentsContent
        list={list}
        search={search}
        order={order}
        pending={pending}
      />
    </div>
  );
}
