import type { ScheduleConflict } from '@/_types/scheduleOutcomes';
import { formatSessionWhen } from '@/_lib/scheduleFormat';
import { TriangleAlert } from 'lucide-react';

interface ScheduleConflictNoticeProps {
  conflict: ScheduleConflict;
}

/** The student and the time that block this one; nothing was saved. Text, not color alone. */
export function ScheduleConflictNotice({
  conflict,
}: ScheduleConflictNoticeProps) {
  return (
    <div
      role="alert"
      className="flex items-start gap-2 rounded-md border border-destructive/40 p-3 text-sm"
    >
      <TriangleAlert className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
      <p>
        Este horário conflita com {conflict.studentName} em{' '}
        {formatSessionWhen(conflict.startAt)}. Nada foi salvo: escolha outro
        horário.
      </p>
    </div>
  );
}
