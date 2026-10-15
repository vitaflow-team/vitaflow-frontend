'use client';

import { assignEducator } from '@/_actions/academia/assignEducator';
import { FormError } from '@/_components/students/formError';
import type { AcademiaEmployment, AcademiaStudent } from '@/_types/academia';
import { useRouter } from 'next/navigation';
import { useState, type ChangeEvent } from 'react';
import { useServerAction } from 'zsa-react';

const UNASSIGNED = '';

function AssignEducatorSelect({
  student,
  employments,
}: {
  student: AcademiaStudent;
  employments: AcademiaEmployment[];
}) {
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
        defaultValue={student.professionalId ?? UNASSIGNED}
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

interface StudentsAssignSectionProps {
  students: AcademiaStudent[];
  employments: AcademiaEmployment[];
}

export function StudentsAssignSection({
  students,
  employments,
}: StudentsAssignSectionProps) {
  if (students.length === 0) {
    return (
      <p className="text-muted-foreground text-sm">
        Nenhum aluno da academia cadastrado ainda.
      </p>
    );
  }

  return (
    <ul className="flex flex-col gap-2">
      {students.map(student => (
        <li
          key={student.id}
          className="bg-card flex items-center justify-between gap-4 rounded-lg border px-4 py-3"
        >
          <div>
            <p className="font-medium">{student.name}</p>
            <p className="text-muted-foreground text-sm">
              {student.professionalId ? '' : 'Sem educador atribuído'}
            </p>
          </div>
          <AssignEducatorSelect student={student} employments={employments} />
        </li>
      ))}
    </ul>
  );
}
