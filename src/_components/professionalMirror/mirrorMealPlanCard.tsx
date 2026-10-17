import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/_components/ui/card';
import { ReadOnlyWeekdayList } from '@/_components/mealPlan/readOnlyWeekdayList';
import { formatRecordedAt } from '@/_lib/formRecordDisplay';
import type { MirrorMealPlan } from '@/_types/professionalMirror';
import { UtensilsCrossed } from 'lucide-react';
import { MirrorMealPlanVersionHistory } from './mirrorMealPlanVersionHistory';

interface MirrorMealPlanCardProps {
  mealPlan: MirrorMealPlan;
}

/** The patient's current published meal plan, with access to its full version history (US-020). */
export function MirrorMealPlanCard({ mealPlan }: MirrorMealPlanCardProps) {
  return (
    <Card className="gap-3 border-line">
      <CardHeader className="grid-cols-[1fr_auto]">
        <CardTitle>Plano alimentar</CardTitle>
        <UtensilsCrossed
          className="size-5 text-icon-accent"
          aria-hidden="true"
        />
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        <p className="text-sm text-muted-foreground">
          Versão {mealPlan.currentVersion} · publicada em{' '}
          {formatRecordedAt(mealPlan.publishedAt)}
        </p>
        <ReadOnlyWeekdayList days={mealPlan.days} />
        <MirrorMealPlanVersionHistory versions={mealPlan.versions} />
      </CardContent>
    </Card>
  );
}
