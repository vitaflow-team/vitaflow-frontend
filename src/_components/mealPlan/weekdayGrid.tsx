import { fullWeek } from '@/_lib/mealPlanWeekdays';
import type { MealPlanDraft, MealPlanVersion } from '@/_types/mealPlan';
import { WeekdayCard } from './weekdayCard';

interface WeekdayGridProps {
  clientId: string;
  draft: MealPlanDraft;
  versions: MealPlanVersion[];
}

export function WeekdayGrid({ clientId, draft, versions }: WeekdayGridProps) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {fullWeek(draft.days).map(({ weekday, day }) => (
        <WeekdayCard
          key={weekday}
          clientId={clientId}
          weekday={weekday}
          day={day}
          draft={draft}
          versions={versions}
        />
      ))}
    </div>
  );
}
