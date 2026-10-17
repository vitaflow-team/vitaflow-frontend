import type { MealPlanDraft, MealPlanVersion } from '@/_types/mealPlan';
import { PublishButton } from './publishButton';
import { VersionHistoryPanel } from './versionHistoryPanel';
import { WeekdayGrid } from './weekdayGrid';

interface MealPlanSectionProps {
  clientId: string;
  draft: MealPlanDraft;
  versions: MealPlanVersion[];
}

/**
 * The patient's meal-plan tab: the current draft by weekday, clone/publish
 * actions and the full version history — every mutation refreshes this
 * section's server-rendered props via `router.refresh()`, so no client-side
 * copy of `draft`/`versions` is kept here (US-012–US-015).
 */
export function MealPlanSection({
  clientId,
  draft,
  versions,
}: MealPlanSectionProps) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-lg font-semibold">Plano alimentar</h2>
        <div className="flex items-center gap-2">
          <VersionHistoryPanel clientId={clientId} versions={versions} />
          <PublishButton clientId={clientId} />
        </div>
      </div>
      <WeekdayGrid clientId={clientId} draft={draft} versions={versions} />
    </div>
  );
}
