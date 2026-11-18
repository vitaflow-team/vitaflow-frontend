import type { EligibleStudent } from '@/_types/eligibleStudent';
import { EligibleSelectionBar } from './eligibleSelectionBar';
import { EligibleStudentRow } from './eligibleStudentRow';

interface EligibleStudentsListProps {
  students: EligibleStudent[];
  selected: string[];
  disabled: boolean;
  onToggle: (clientId: string) => void;
  onSelectAll: () => void;
  onClear: () => void;
}

/** The students that can be activated, with the whole selection one click away. */
export function EligibleStudentsList({
  students,
  selected,
  disabled,
  onToggle,
  onSelectAll,
  onClear,
}: EligibleStudentsListProps) {
  if (students.length === 0) {
    return (
      <p className="text-sm">
        Nenhum aluno para ativar. Todos os alunos com plano já têm cobrança
        mensal.
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      <EligibleSelectionBar
        selectedCount={selected.length}
        total={students.length}
        disabled={disabled}
        onSelectAll={onSelectAll}
        onClear={onClear}
      />
      <ul aria-label="Alunos para ativar" className="flex flex-col gap-2">
        {students.map(student => (
          <EligibleStudentRow
            key={student.clientId}
            student={student}
            checked={selected.includes(student.clientId)}
            disabled={disabled}
            onToggle={onToggle}
          />
        ))}
      </ul>
    </div>
  );
}
