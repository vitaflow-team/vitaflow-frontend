import { Button } from '@/_components/ui/button';
import { WEEKDAY_LABELS } from '@/_lib/mealPlanWeekdays';
import type { MealPlanDay } from '@/_types/mealPlan';

interface SourceDayListProps {
  days: MealPlanDay[];
  disabled: boolean;
  onSelect: (sourceDayId: string) => void;
}

/** The days available to clone from, each showing a meal-count hint. */
export function SourceDayList({
  days,
  disabled,
  onSelect,
}: SourceDayListProps) {
  if (days.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        Nenhum dia com refeições para clonar.
      </p>
    );
  }

  return (
    <ul className="flex flex-col gap-2">
      {days.map(day => (
        <li key={day.id}>
          <Button
            type="button"
            variant="outline"
            disabled={disabled}
            onClick={() => onSelect(day.id)}
            className="w-full justify-between"
          >
            {WEEKDAY_LABELS[day.weekday]}
            <span className="text-muted-foreground text-xs">
              {day.meals.length} refeição(ões)
            </span>
          </Button>
        </li>
      ))}
    </ul>
  );
}
