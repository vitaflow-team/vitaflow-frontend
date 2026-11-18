import type { ReceptionistStudent } from '@/_actions/checkin/searchStudents';
import { Button } from '@/_components/ui/button';

interface StudentResultsProps {
  results: ReceptionistStudent[];
  onSelect: (student: ReceptionistStudent) => void;
}

/** The students a search found, one tap each; an empty search says so in words. */
export function StudentResults({ results, onSelect }: StudentResultsProps) {
  if (results.length === 0) {
    return <p className="text-sm text-muted-foreground">Nenhum resultado.</p>;
  }

  return (
    <ul className="flex flex-col gap-2">
      {results.map(student => (
        <li key={student.id}>
          <Button
            type="button"
            variant="outline"
            className="w-full justify-start"
            onClick={() => onSelect(student)}
          >
            {student.name}
          </Button>
        </li>
      ))}
    </ul>
  );
}
