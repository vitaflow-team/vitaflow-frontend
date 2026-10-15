'use client';

import { Input } from '@/_components/ui/input';
import { useProfessoresSearch } from '@/_hooks/useProfessoresSearch';
import { Search } from 'lucide-react';

interface ProfessoresSearchProps {
  initialQuery: string;
}

export function ProfessoresSearch({ initialQuery }: ProfessoresSearchProps) {
  const { value, setValue } = useProfessoresSearch(initialQuery);

  return (
    <div role="search" className="w-full sm:max-w-sm">
      <label htmlFor="professor-search" className="sr-only">
        Buscar professor por nome ou e-mail
      </label>
      <Input
        id="professor-search"
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
