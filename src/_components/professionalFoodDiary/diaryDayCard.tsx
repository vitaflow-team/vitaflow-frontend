import { Card, CardContent, CardHeader } from '@/_components/ui/card';
import { MEAL_TYPE_LABELS } from '@/_constants/mealTypeLabels';
import { formatIsoDay } from '@/_lib/studentsDates';
import type { DiaryDay } from '@/_lib/professionalFoodDiaryHistory';
import { Droplets } from 'lucide-react';

interface DiaryDayCardProps {
  day: DiaryDay;
}

/** One calendar day's meals and water count, read only. */
export function DiaryDayCard({ day }: DiaryDayCardProps) {
  return (
    <Card className="gap-3 border-line">
      <CardHeader className="grid-cols-[1fr_auto]">
        <time dateTime={day.date} className="font-medium">
          {formatIsoDay(day.date)}
        </time>
        {day.waterCount > 0 && (
          <span className="flex items-center gap-1 text-sm text-muted-foreground">
            <Droplets className="size-4 text-icon-accent" aria-hidden="true" />
            {day.waterCount} copos
          </span>
        )}
      </CardHeader>
      <CardContent>
        {day.meals.length > 0 ? (
          <ul className="flex flex-col gap-2">
            {day.meals.map(meal => (
              <li
                key={meal.id}
                className="flex items-center justify-between gap-2 rounded-md border border-line px-3 py-2 text-sm"
              >
                <span>{meal.description}</span>
                <span className="text-muted-foreground">
                  {MEAL_TYPE_LABELS[meal.mealType]} ·{' '}
                  {meal.calories.toLocaleString('pt-BR')} kcal
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-muted-foreground">
            Nenhuma refeição registrada neste dia.
          </p>
        )}
      </CardContent>
    </Card>
  );
}
