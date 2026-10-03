'use client';

import { Input } from '@/_components/ui/input';
import { useStudentSearch } from '@/_hooks/useStudentSearch';
import { Search } from 'lucide-react';

interface StudentSearchProps {
  initialQuery: string;
}

export function StudentSearch({ initialQuery }: StudentSearchProps) {
  const { value, setValue } = useStudentSearch(initialQuery);

  return (
    <div role="search" className="w-full sm:max-w-sm">
      <label htmlFor="student-search" className="sr-only">
        Buscar aluno por nome ou e-mail
      </label>
      <Input
        id="student-search"
        type="search"
        inputMode="search"
        autoComplete="off"
        icon={Search}
        placeholder="Buscar por nome ou e-mail"
        value={value}
        onChange={event => setValue(event.target.value)}
      />
    </div>
  );
}
