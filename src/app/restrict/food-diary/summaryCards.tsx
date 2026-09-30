import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/_components/ui/card';
import { Droplets, Flame, Trophy } from 'lucide-react';
import type { DailySummary } from '@/_types/foodDiary';
import { WaterTapControl } from './waterTapControl';

interface SummaryCardsProps {
  summary: DailySummary;
  date: string;
}

export function SummaryCards({ summary, date }: SummaryCardsProps) {
  return (
    <section
      aria-label="Resumo do dia"
      className="grid grid-cols-3 gap-2 md:gap-4"
    >
      <Card className="min-w-0 gap-2 py-4 md:gap-3 md:py-6">
        <CardHeader className="grid-cols-[1fr_auto] items-center gap-1 px-3 md:px-6">
          <CardTitle className="text-xs md:text-base">Calorias</CardTitle>
          <Flame
            className="size-4 text-icon-accent md:size-5"
            aria-hidden="true"
          />
        </CardHeader>
        <CardContent className="px-3 md:px-6">
          <p className="text-lg font-semibold md:text-3xl">
            {summary.totalCalories.toLocaleString('pt-BR')}
            <span className="text-xs font-normal text-muted-foreground md:text-sm">
              {' '}
              kcal
            </span>
          </p>
          <p className="mt-1 text-[0.6875rem] leading-tight text-muted-foreground md:mt-2 md:text-sm">
            {summary.goal !== null ? (
              <>de {summary.goal.toLocaleString('pt-BR')} kcal (estimado)</>
            ) : (
              'Complete seu perfil para ver sua meta'
            )}
          </p>
        </CardContent>
      </Card>

      <Card className="min-w-0 gap-2 py-4 md:gap-3 md:py-6">
        <CardHeader className="grid-cols-[1fr_auto] items-center gap-1 px-3 md:px-6">
          <CardTitle className="text-xs md:text-base">Água</CardTitle>
          <Droplets
            className="size-4 text-icon-accent md:size-5"
            aria-hidden="true"
          />
        </CardHeader>
        <CardContent className="px-3 md:px-6">
          <WaterTapControl date={date} initialCount={summary.waterCount} />
        </CardContent>
      </Card>

      <Card className="min-w-0 gap-2 py-4 md:gap-3 md:py-6">
        <CardHeader className="grid-cols-[1fr_auto] items-center gap-1 px-3 md:px-6">
          <CardTitle className="text-xs md:text-base">Sequência</CardTitle>
          <Trophy
            className="size-4 text-icon-accent md:size-5"
            aria-hidden="true"
          />
        </CardHeader>
        <CardContent className="px-3 md:px-6">
          <p className="text-lg font-semibold md:text-3xl">
            {summary.streak}
            <span className="text-xs font-normal text-muted-foreground md:text-sm">
              {' '}
              {summary.streak === 1 ? 'dia' : 'dias'}
            </span>
          </p>
        </CardContent>
      </Card>
    </section>
  );
}
