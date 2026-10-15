'use client';

import { assignEducator } from '@/_actions/academia/assignEducator';
import { FormError } from '@/_components/students/formError';
import type { AcademiaEmployment } from '@/_types/academia';
import type { AcademiaStudentListItem } from '@/_types/academiaAlunos';
import { useRouter } from 'next/navigation';
import { useState, type ChangeEvent } from 'react';
import { useServerAction } from 'zsa-react';

const UNASSIGNED = '';

interface AcademiaAlunoAssignSelectProps {
  student: AcademiaStudentListItem;
  employments: AcademiaEmployment[];
}

export function AcademiaAlunoAssignSelect({
  student,
  employments,
}: AcademiaAlunoAssignSelectProps) {
  const router = useRouter();
  const action = useServerAction(assignEducator);
  const [error, setError] = useState<string | null>(null);

  async function handleChange(event: ChangeEvent<HTMLSelectElement>) {
    setError(null);
    const value = event.target.value;
    const [, failure] = await action.execute({
      studentId: student.id,
      professionalId: value === UNASSIGNED ? null : value,
    });
    if (failure) {
      setError(failure.message);
      return;
    }
    router.refresh();
  }

  return (
    <div className="flex flex-col gap-1">
      <select
        defaultValue={student.assignedEducator?.id ?? UNASSIGNED}
        onChange={handleChange}
        disabled={action.isPending}
        className="h-10 rounded-md border border-input bg-background px-3 text-sm"
        aria-label={`Educador de ${student.name}`}
      >
        <option value={UNASSIGNED}>Sem educador</option>
        {employments.map(employment => (
          <option key={employment.educatorId} value={employment.educatorId}>
            {employment.educator.name}
          </option>
        ))}
      </select>
      <FormError message={error} />
    </div>
  );
}
