import { Button } from '@/_components/ui/button';
import { formatTimeRange } from '@/_lib/scheduleFormat';
import type { FixedTime } from '@/_types/educatorSchedule';
import { FixedTimeDialog } from './fixedTimeDialog';
import { RemoveFixedTimeDialog } from './removeFixedTimeDialog';

interface FixedTimeItemProps {
  studentId: string;
  fixedTime: FixedTime;
  sessionNames: string[];
}

/** One fixed time: its span, type, letter with the session's name, and the missing-workout notice as text. */
export function FixedTimeItem({
  studentId,
  fixedTime,
  sessionNames,
}: FixedTimeItemProps) {
  const range = formatTimeRange(
    fixedTime.startMinute,
    fixedTime.durationMinutes
  );
  const typeLabel = fixedTime.type === 'ONLINE' ? 'Online' : 'Presencial';

  return (
    <li className="flex flex-col gap-2 rounded-md border border-line p-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="min-w-0 text-sm">
        <p className="font-medium">{range}</p>
        <p className="text-muted-foreground">
          {typeLabel}
          {fixedTime.workoutLetter && (
            <>
              {' · '}
              Treino {fixedTime.workoutLetter}
              {fixedTime.workoutSessionName
                ? ` — ${fixedTime.workoutSessionName}`
                : ''}
            </>
          )}
        </p>
        {fixedTime.workoutMissing && (
          <p role="status" className="mt-1 font-medium">
            O treino vinculado não existe mais: o horário aparece sem nome de
            sessão.
          </p>
        )}
      </div>
      <div className="flex flex-wrap gap-2">
        <FixedTimeDialog
          studentId={studentId}
          fixedTime={fixedTime}
          sessionNames={sessionNames}
          trigger={
            <Button type="button" variant="outline" size="sm">
              Alterar
            </Button>
          }
        />
        <RemoveFixedTimeDialog
          studentId={studentId}
          fixedTimeId={fixedTime.id}
          weekday={fixedTime.weekday}
          time={range.slice(0, 5)}
        />
      </div>
    </li>
  );
}
