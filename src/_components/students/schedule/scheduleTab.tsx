import { buttonVariants } from '@/_components/ui/button';
import { FIXED_TIME_LIMIT } from '@/_constants/educatorScheduleLimits';
import type { StudentSchedule } from '@/_types/educatorSchedule';
import { FixedTimeDialog } from './fixedTimeDialog';
import { UpcomingList } from './upcomingList';
import { WeekView } from './weekView';
import { Plus } from 'lucide-react';

interface ScheduleTabProps {
  studentId: string;
  schedule: StudentSchedule;
  sessionNames: string[];
}

const REMINDER_NOTE =
  'Você e o aluno recebem um aviso uma hora antes de cada sessão agendada.';

function EmptyState({
  studentId,
  sessionNames,
}: {
  studentId: string;
  sessionNames: string[];
}) {
  return (
    <div className="flex flex-col items-start gap-3 rounded-lg border border-dashed border-line px-4 py-8">
      <p className="text-sm text-muted-foreground">
        Este aluno ainda não tem horário fixo. Adicione o primeiro dia e horário
        da semana.
      </p>
      <FixedTimeDialog
        studentId={studentId}
        fixedTime={null}
        sessionNames={sessionNames}
        trigger={
          <button type="button" className={buttonVariants({})}>
            <Plus aria-hidden="true" />
            Adicionar horário
          </button>
        }
      />
    </div>
  );
}

/** The "Horários" tab: the week, the coming sessions, and the add action with its limit. */
export function ScheduleTab({
  studentId,
  schedule,
  sessionNames,
}: ScheduleTabProps) {
  const full = schedule.fixedTimes.length >= FIXED_TIME_LIMIT;
  if (schedule.fixedTimes.length === 0) {
    return <EmptyState studentId={studentId} sessionNames={sessionNames} />;
  }

  return (
    <section aria-labelledby="schedule-title" className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 id="schedule-title" className="text-lg font-semibold">
            Horários
          </h2>
          <p className="text-sm text-muted-foreground">{REMINDER_NOTE}</p>
        </div>
        <div className="flex flex-col items-end gap-1">
          <FixedTimeDialog
            studentId={studentId}
            fixedTime={null}
            sessionNames={sessionNames}
            trigger={
              <button
                type="button"
                className={buttonVariants({})}
                disabled={full}
                aria-describedby={full ? 'schedule-limit' : undefined}
              >
                <Plus aria-hidden="true" />
                Adicionar horário
              </button>
            }
          />
          {full && (
            <p id="schedule-limit" className="text-xs text-muted-foreground">
              Um aluno pode ter no máximo {FIXED_TIME_LIMIT} horários fixos.
            </p>
          )}
        </div>
      </div>
      <WeekView
        studentId={studentId}
        fixedTimes={schedule.fixedTimes}
        sessionNames={sessionNames}
      />
      <div className="flex flex-col gap-2">
        <h3 className="text-sm font-semibold">Próximas sessões</h3>
        <UpcomingList items={schedule.upcoming} />
      </div>
    </section>
  );
}
