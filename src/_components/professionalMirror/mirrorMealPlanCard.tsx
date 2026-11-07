import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/_components/ui/card';
import { buttonVariants } from '@/_components/ui/button';
import { ReadOnlyWeekdayList } from '@/_components/mealPlan/readOnlyWeekdayList';
import { formatRecordedAt } from '@/_lib/formRecordDisplay';
import type { MirrorMealPlan } from '@/_types/professionalMirror';
import { UtensilsCrossed } from 'lucide-react';
import Link from 'next/link';
import { MirrorMealPlanVersionHistory } from './mirrorMealPlanVersionHistory';

interface MirrorMealPlanCardProps {
  mealPlan: MirrorMealPlan;
}

/**
 * The patient's current published meal plan, with access to its full
 * version history (US-020) and their own PDF export of it (US-002) —
 * rendered only when a meal plan exists, so the export link never points
 * at a request that would 404 (US-002.EC-1).
 */
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
        <div className="flex items-center gap-2">
          <MirrorMealPlanVersionHistory versions={mealPlan.versions} />
          <Link
            href={`/api/me/nutritionist/meal-plan/versions/${mealPlan.currentVersion}/pdf`}
            className={buttonVariants({ variant: 'outline', size: 'sm' })}
          >
            Exportar PDF
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
