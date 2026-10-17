import type { MealPlanDraft } from '@/_types/mealPlan';

export type CloneDayOutcome =
  | { outcome: 'cloned'; draft: MealPlanDraft }
  | { outcome: 'confirm_overwrite_required' };
