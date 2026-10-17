import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/_components/ui/card';
import { WEEKDAY_LABELS, hasContent } from '@/_lib/mealPlanWeekdays';
import type {
  MealPlanDay,
  MealPlanDraft,
  MealPlanVersion,
  Weekday,
} from '@/_types/mealPlan';
import { CloneDayDialog } from './cloneDayDialog';
import { DayEditDialog } from './dayEditDialog';

interface WeekdayCardProps {
  clientId: string;
  weekday: Weekday;
  day: MealPlanDay | null;
  draft: MealPlanDraft;
  versions: MealPlanVersion[];
}

/**
 * One weekday: obviously empty or filled at a glance (PRD design principle).
 * A Server Component — every mutation's own dialog already closes itself and
 * calls `router.refresh()`, so no callback crosses back up from here (a
 * plain function prop from a Server to a Client Component cannot be
 * serialized across that boundary).
 */
export function WeekdayCard({
  clientId,
  weekday,
  day,
  draft,
  versions,
}: WeekdayCardProps) {
  const filled = hasContent(day);

  return (
    <Card className={filled ? undefined : 'border-dashed'}>
      <CardHeader className="flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <span
            aria-hidden="true"
            className={`size-2 rounded-full ${filled ? 'bg-primary' : 'bg-muted-foreground/30'}`}
          />
          {WEEKDAY_LABELS[weekday]}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        {filled ? (
          <ul className="flex flex-col gap-2 text-sm">
            {day?.meals.map(meal => (
              <li key={meal.id}>
                <p className="font-medium">{meal.label}</p>
                <p className="text-muted-foreground whitespace-pre-wrap">
                  {meal.text}
                </p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-muted-foreground">
            Nenhuma refeição definida.
          </p>
        )}
        <div className="flex flex-wrap items-center gap-2">
          <DayEditDialog
            clientId={clientId}
            weekday={weekday}
            day={day}
            triggerLabel={filled ? 'Editar' : 'Adicionar refeições'}
          />
          <CloneDayDialog
            clientId={clientId}
            targetWeekday={weekday}
            draft={draft}
            versions={versions}
          />
        </div>
      </CardContent>
    </Card>
  );
}
