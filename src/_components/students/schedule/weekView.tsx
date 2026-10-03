import type { FixedTime } from '@/_types/educatorSchedule';
import { WEEKDAY_NAMES } from '@/_constants/educatorScheduleLimits';
import { FixedTimeItem } from './fixedTimeItem';

interface WeekViewProps {
  studentId: string;
  fixedTimes: FixedTime[];
  sessionNames: string[];
}

/** The seven days in order; each day lists its times by start. Empty days say so. */
export function WeekView({
  studentId,
  fixedTimes,
  sessionNames,
}: WeekViewProps) {
  return (
    <ol
      className="flex flex-col divide-y divide-line rounded-md border border-line"
      aria-label="Semana"
    >
      {Object.entries(WEEKDAY_NAMES).map(([weekday, name]) => {
        const day = fixedTimes
          .filter(time => time.weekday === Number(weekday))
          .sort((a, b) => a.startMinute - b.startMinute);

        return (
          <li
            key={weekday}
            className="flex flex-col gap-2 p-3 sm:flex-row sm:gap-4"
          >
            <h3 className="w-40 shrink-0 text-sm font-semibold">{name}</h3>
            {day.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                Nenhum horário fixo.
              </p>
            ) : (
              <ul className="flex min-w-0 flex-1 flex-col gap-2">
                {day.map(time => (
                  <FixedTimeItem
                    key={time.id}
                    studentId={studentId}
                    fixedTime={time}
                    sessionNames={sessionNames}
                  />
                ))}
              </ul>
            )}
          </li>
        );
      })}
    </ol>
  );
}
