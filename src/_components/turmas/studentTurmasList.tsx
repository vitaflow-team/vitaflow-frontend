import type { StudentTurmaItem } from '@/_types/studentTurmas';
import { minutesToTime, WEEKDAY_LABELS } from '@/_lib/turmaSchedule';
import { StudentTurmaEnrollButton } from './studentTurmaEnrollButton';

interface StudentTurmasListProps {
  items: StudentTurmaItem[];
}

export function StudentTurmasList({ items }: StudentTurmasListProps) {
  return (
    <ul aria-label="Turmas" className="flex flex-col gap-2">
      {items.map(item => (
        <li
          key={item.id}
          className="bg-card flex flex-col gap-2 rounded-lg border p-4 sm:flex-row sm:items-center sm:justify-between"
        >
          <div className="flex min-w-0 flex-col gap-1">
            <span className="font-semibold break-words">{item.name}</span>
            <span className="text-muted-foreground text-sm">
              {item.academiaName}
            </span>
            <span className="text-muted-foreground text-sm">
              {WEEKDAY_LABELS[item.weekday]} · {minutesToTime(item.startMinute)}
              {' · '}
              {item.enrolledCount}/{item.capacity} vagas
            </span>
            <span className="text-muted-foreground text-sm">
              {item.responsibleEducator
                ? `Educador: ${item.responsibleEducator.name}`
                : 'Sem responsável'}
            </span>
          </div>
          <StudentTurmaEnrollButton
            turmaId={item.id}
            enrolled={item.enrolled}
            isFull={!item.enrolled && item.enrolledCount >= item.capacity}
          />
        </li>
      ))}
    </ul>
  );
}
