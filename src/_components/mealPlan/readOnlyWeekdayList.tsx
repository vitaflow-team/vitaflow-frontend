import { WEEKDAY_LABELS, fullWeek, hasContent } from '@/_lib/mealPlanWeekdays';
import type { MealPlanMeal, Weekday } from '@/_types/mealPlan';

interface ReadOnlyWeekdayListProps {
  days: Array<{ weekday: Weekday; meals: MealPlanMeal[] }>;
}

/** A published version's content, read-only — never offered for direct editing (ADR-013). */
export function ReadOnlyWeekdayList({ days }: ReadOnlyWeekdayListProps) {
  return (
    <ul className="flex flex-col gap-3">
      {fullWeek(days).map(({ weekday, day }) => (
        <li key={weekday} className="border-b border-line pb-3 last:border-b-0">
          <p className="font-medium">{WEEKDAY_LABELS[weekday]}</p>
          {hasContent(day) ? (
            <ul className="flex flex-col gap-1 text-sm">
              {day?.meals.map(meal => (
                <li key={meal.id}>
                  <span className="font-medium">{meal.label}: </span>
                  <span className="text-muted-foreground">{meal.text}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-muted-foreground">
              Nenhuma refeição definida.
            </p>
          )}
        </li>
      ))}
    </ul>
  );
}
