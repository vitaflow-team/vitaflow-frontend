import type { AvailabilityWindow } from '@/_types/scheduling';

const DAY_LABELS: Record<number, string> = {
  1: 'Segunda',
  2: 'Terça',
  3: 'Quarta',
  4: 'Quinta',
  5: 'Sexta',
  6: 'Sábado',
  7: 'Domingo',
};

function formatMinutes(minutes: number): string {
  const hours = Math.floor(minutes / 60)
    .toString()
    .padStart(2, '0');
  const mins = (minutes % 60).toString().padStart(2, '0');
  return `${hours}:${mins}`;
}

interface AvailabilityListProps {
  windows: AvailabilityWindow[];
}

/** US-001.EC-2: an honest empty state when nothing is published yet. */
export function AvailabilityList({ windows }: AvailabilityListProps) {
  if (windows.length === 0) {
    return (
      <p className="text-muted-foreground text-sm">
        Você ainda não publicou nenhum horário de disponibilidade.
      </p>
    );
  }

  return (
    <ul aria-label="Disponibilidade publicada" className="flex flex-col gap-2">
      {windows.map(window => (
        <li
          key={window.id}
          className="bg-card flex items-center justify-between gap-2 rounded-lg border p-3 text-sm"
        >
          <span className="font-semibold">{DAY_LABELS[window.dayOfWeek]}</span>
          <span className="text-muted-foreground">
            {formatMinutes(window.startMinute)}–
            {formatMinutes(window.endMinute)}
          </span>
          <span className="text-muted-foreground">
            {window.sessionDurationMinutes} min por sessão
          </span>
        </li>
      ))}
    </ul>
  );
}
