import type { ProfessoresList as ProfessoresListType } from '@/_types/professores';
import { InviteProfessorPanel } from './inviteProfessorPanel';
import { ProfessoresEmptyState } from './professoresEmptyState';
import { ProfessoresList } from './professoresList';
import { ProfessoresNoResults } from './professoresNoResults';
import { ProfessoresPagination } from './professoresPagination';
import { ProfessoresSearch } from './professoresSearch';

interface ProfessoresViewProps {
  list: ProfessoresListType;
  search?: string;
}

function ProfessoresContent({ list, search }: ProfessoresViewProps) {
  if (list.total === 0) {
    return search ? (
      <ProfessoresNoResults search={search} />
    ) : (
      <ProfessoresEmptyState />
    );
  }

  return (
    <>
      <ProfessoresList items={list.items} />
      <ProfessoresPagination
        search={search}
        page={list.page}
        total={list.total}
        pageSize={list.pageSize}
      />
    </>
  );
}

export function ProfessoresView({ list, search }: ProfessoresViewProps) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-semibold">Professores</h1>
        {list.total > 0 && <InviteProfessorPanel />}
      </div>
      <ProfessoresSearch initialQuery={search ?? ''} />
      <ProfessoresContent list={list} search={search} />
    </div>
  );
}
