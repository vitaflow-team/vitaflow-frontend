import type { StudentOwnership } from '@/_lib/addStudentFlow';
import type { EducatorEmployment } from '@/_types/educatorEmployment';

interface StudentOwnershipFieldProps {
  employments: EducatorEmployment[];
  ownership: StudentOwnership;
  academiaId: string | null;
  disabled: boolean;
  onOwnershipChange: (ownership: StudentOwnership) => void;
  onAcademiaChange: (academiaId: string) => void;
}

export function StudentOwnershipField({
  employments,
  ownership,
  academiaId,
  disabled,
  onOwnershipChange,
  onAcademiaChange,
}: StudentOwnershipFieldProps) {
  if (employments.length === 0) return null;

  return (
    <div className="flex flex-col gap-2">
      <span className="text-sm font-medium">Este aluno é</span>
      <div className="flex gap-4">
        <label className="flex items-center gap-2 text-sm">
          <input
            type="radio"
            name="student-ownership"
            value="PARTICULAR"
            checked={ownership === 'PARTICULAR'}
            disabled={disabled}
            onChange={() => onOwnershipChange('PARTICULAR')}
          />
          Particular (meu)
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="radio"
            name="student-ownership"
            value="ACADEMIA"
            checked={ownership === 'ACADEMIA'}
            disabled={disabled}
            onChange={() => onOwnershipChange('ACADEMIA')}
          />
          Da academia
        </label>
      </div>
      {ownership === 'ACADEMIA' && employments.length > 1 && (
        <select
          aria-label="Qual academia"
          value={academiaId ?? ''}
          disabled={disabled}
          onChange={event => onAcademiaChange(event.target.value)}
          className="h-10 rounded-md border border-input bg-background px-3 text-sm"
        >
          <option value="" disabled>
            Selecione a academia
          </option>
          {employments.map(employment => (
            <option key={employment.academiaId} value={employment.academiaId}>
              {employment.academia.name}
            </option>
          ))}
        </select>
      )}
    </div>
  );
}
