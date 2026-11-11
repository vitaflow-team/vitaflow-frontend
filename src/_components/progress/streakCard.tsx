import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/_components/ui/card';
import type { StreakSummaryDTO } from '@/_types/progress';
import { Flame } from 'lucide-react';

interface StreakCardProps {
  streak: StreakSummaryDTO;
}

export function StreakCard({ streak }: StreakCardProps) {
  return (
    <Card className="min-w-0">
      <CardHeader className="grid-cols-[1fr_auto] items-center gap-1">
        <CardTitle className="text-base">Sequência do diário</CardTitle>
        <Flame className="size-5 text-icon-accent" aria-hidden="true" />
      </CardHeader>
      <CardContent>
        <p className="text-3xl font-semibold">
          {streak.currentDays}{' '}
          <span className="text-base font-normal text-muted-foreground">
            {streak.currentDays === 1 ? 'dia seguido' : 'dias seguidos'}
          </span>
        </p>
        <p className="mt-1 text-sm text-muted-foreground">
          Melhor sequência: {streak.personalBestDays}{' '}
          {streak.personalBestDays === 1 ? 'dia' : 'dias'}
        </p>
      </CardContent>
    </Card>
  );
}
