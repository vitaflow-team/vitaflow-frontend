'use client';

import { assignTurmaEducator } from '@/_actions/academia/turmas/assignTurmaEducator';
import { FormError } from '@/_components/students/formError';
import type { AcademiaEmployment } from '@/_types/academia';
import type { TurmaAgendaItem } from '@/_types/turmas';
import { useRouter } from 'next/navigation';
import { useState, type ChangeEvent } from 'react';
import { useServerAction } from 'zsa-react';

const UNASSIGNED = '';

interface TurmaEducatorSelectProps {
  turma: TurmaAgendaItem;
  employments: AcademiaEmployment[];
}

export function TurmaEducatorSelect({
  turma,
  employments,
}: TurmaEducatorSelectProps) {
  const router = useRouter();
  const action = useServerAction(assignTurmaEducator);
  const [error, setError] = useState<string | null>(null);

  async function handleChange(event: ChangeEvent<HTMLSelectElement>) {
    setError(null);
    const value = event.target.value;
    const [, failure] = await action.execute({
      turmaId: turma.id,
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
        defaultValue={turma.responsibleEducator?.id ?? UNASSIGNED}
        onChange={handleChange}
        disabled={action.isPending}
        className="h-10 rounded-md border border-input bg-background px-3 text-sm"
        aria-label={`Educador responsável por ${turma.name}`}
      >
        <option value={UNASSIGNED}>Sem responsável</option>
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
