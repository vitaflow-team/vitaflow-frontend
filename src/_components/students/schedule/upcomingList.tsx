import {
  brtStartMinute,
  formatSessionWhen,
  formatTimeRange,
} from '@/_lib/scheduleFormat';
import type { UpcomingSession } from '@/_types/educatorSchedule';

interface UpcomingListProps {
  items: UpcomingSession[];
}

function statusText(item: UpcomingSession): string | null {
  if (item.status === 'CANCELED')
    return 'Cancelada: esta data não ocupa o horário';
  if (item.source === 'BOOKING') return 'Reservada pelo aluno';
  return null;
}

/** The coming sessions in time order; a canceled date is said in words, not only struck through. */
export function UpcomingList({ items }: UpcomingListProps) {
  if (items.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        Nenhuma sessão nos próximos 28 dias.
      </p>
    );
  }

  return (
    <ul
      className="flex flex-col divide-y divide-line rounded-md border border-line"
      aria-label="Próximas sessões"
    >
      {items.map(item => {
        const minutes =
          (new Date(item.endAt).getTime() - new Date(item.startAt).getTime()) /
          60000;
        const start = brtStartMinute(item.startAt);
        const status = statusText(item);
        return (
          <li key={item.id} className="flex flex-col gap-1 p-3 text-sm">
            <p className="font-medium">{formatSessionWhen(item.startAt)}</p>
            <p className="text-muted-foreground">
              {formatTimeRange(start, minutes)} ·{' '}
              {item.type === 'ONLINE' ? 'Online' : 'Presencial'}
              {item.workoutSessionName ? ` · ${item.workoutSessionName}` : ''}
            </p>
            {status && <p className="font-medium">{status}</p>}
          </li>
        );
      })}
    </ul>
  );
}
