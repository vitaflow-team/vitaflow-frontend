import type { ReceptionistStudent } from '@/_actions/checkin/searchStudents';
import { FormError } from '@/_components/students/formError';
import { Button } from '@/_components/ui/button';
import { Input } from '@/_components/ui/input';
import { Search } from 'lucide-react';
import { StudentResults } from './studentResults';

interface StudentSearchPanelProps {
  query: string;
  results: ReceptionistStudent[] | null;
  isPending: boolean;
  error: string | null;
  onQueryChange: (query: string) => void;
  onSearch: () => void;
  onSelect: (student: ReceptionistStudent) => void;
}

/** The receptionist's search: a name, the matching students, one tap to choose. */
export function StudentSearchPanel({
  query,
  results,
  isPending,
  error,
  onQueryChange,
  onSearch,
  onSelect,
}: StudentSearchPanelProps) {
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-semibold">Check-in</h1>
      <div className="flex gap-2">
        <Input
          icon={Search}
          placeholder="Nome do aluno"
          value={query}
          onChange={event => onQueryChange(event.target.value)}
          onKeyDown={event => {
            if (event.key === 'Enter') {
              event.preventDefault();
              onSearch();
            }
          }}
        />
        <Button type="button" disabled={isPending} onClick={onSearch}>
          Buscar
        </Button>
      </div>
      <FormError message={error} />
      {results !== null && (
        <StudentResults results={results} onSelect={onSelect} />
      )}
    </div>
  );
}
