import { buttonVariants } from '@/_components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/_components/ui/card';
import { formatSessionWhen } from '@/_lib/scheduleFormat';
import { studentTabHref } from '@/_lib/studentsTabs';
import type { NextSessionSummary } from '@/_types/educatorSchedule';
import Link from 'next/link';

interface NextSessionCardProps {
  studentId: string;
  nextSession: NextSessionSummary | null;
}

/** "Próximo horário" on the overview: the next time with this educator, or an empty state. */
export function NextSessionCard({
  studentId,
  nextSession,
}: NextSessionCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Próximo horário</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-start gap-3">
        {nextSession ? (
          <>
            <p className="font-medium">
              {formatSessionWhen(nextSession.startAt)}
            </p>
            <p className="text-sm text-muted-foreground">
              {nextSession.type === 'ONLINE' ? 'Online' : 'Presencial'}
            </p>
            <Link
              href={studentTabHref(studentId, 'schedule')}
              className={buttonVariants({ variant: 'outline' })}
            >
              Ver agenda
            </Link>
          </>
        ) : (
          <>
            <p className="text-sm text-muted-foreground">
              Nenhum horário definido para este aluno.
            </p>
            <Link
              href={studentTabHref(studentId, 'schedule')}
              className={buttonVariants({ variant: 'outline' })}
            >
              Adicionar horário
            </Link>
          </>
        )}
      </CardContent>
    </Card>
  );
}
