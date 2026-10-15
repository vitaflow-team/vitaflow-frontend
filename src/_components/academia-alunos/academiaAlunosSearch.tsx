'use client';

import { Input } from '@/_components/ui/input';
import { useAcademiaAlunosSearch } from '@/_hooks/useAcademiaAlunosSearch';
import type { HorarioFilter } from '@/_lib/academiaAlunosList';
import { Search } from 'lucide-react';

interface AcademiaAlunosSearchProps {
  initialQuery: string;
  horario: HorarioFilter;
}

export function AcademiaAlunosSearch({
  initialQuery,
  horario,
}: AcademiaAlunosSearchProps) {
  const { value, setValue } = useAcademiaAlunosSearch(initialQuery, horario);

  return (
    <div role="search" className="w-full sm:max-w-sm">
      <label htmlFor="aluno-search" className="sr-only">
        Buscar aluno por nome ou educador
      </label>
      <Input
        id="aluno-search"
        type="search"
        inputMode="search"
        autoComplete="off"
        icon={Search}
        placeholder="Buscar por nome ou educador"
        value={value}
        onChange={event => setValue(event.target.value)}
      />
    </div>
  );
}
