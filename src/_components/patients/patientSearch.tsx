'use client';

import { Input } from '@/_components/ui/input';
import { usePatientSearch } from '@/_hooks/usePatientSearch';
import { Search } from 'lucide-react';

interface PatientSearchProps {
  initialQuery: string;
}

export function PatientSearch({ initialQuery }: PatientSearchProps) {
  const { value, setValue } = usePatientSearch(initialQuery);

  return (
    <div role="search" className="w-full sm:max-w-sm">
      <label htmlFor="patient-search" className="sr-only">
        Buscar paciente por nome ou e-mail
      </label>
      <Input
        id="patient-search"
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
