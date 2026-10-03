import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/_components/ui/card';
import {
  brtWeekday,
  formatSessionWhen,
  weekdayName,
} from '@/_lib/scheduleFormat';
import type { MirrorNextSchedule } from '@/_types/professionalMirror';
import { CalendarClock } from 'lucide-react';

interface NextScheduleCardProps {
  nextSchedule: MirrorNextSchedule;
}

/** "Próximo horário": weekday, time, type and the session name, as text. */
export function NextScheduleCard({ nextSchedule }: NextScheduleCardProps) {
  const weekday = weekdayName(brtWeekday(nextSchedule.startAt));
  return (
    <Card className="gap-3 border-line">
      <CardHeader className="grid-cols-[1fr_auto]">
        <CardTitle>Próximo horário</CardTitle>
        <CalendarClock className="size-5 text-icon-accent" aria-hidden="true" />
      </CardHeader>
      <CardContent className="flex flex-col gap-1 text-sm">
        <p className="font-medium">
          {weekday}, {formatSessionWhen(nextSchedule.startAt)}
        </p>
        <p className="text-muted-foreground">
          {nextSchedule.type === 'ONLINE' ? 'Online' : 'Presencial'}
          {nextSchedule.workoutSessionName
            ? ` · Treino ${nextSchedule.workoutLetter} — ${nextSchedule.workoutSessionName}`
            : ''}
        </p>
      </CardContent>
    </Card>
  );
}
