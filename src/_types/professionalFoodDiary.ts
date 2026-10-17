import type { Meal } from '@/_types/foodDiary';

export interface WaterLogEntry {
  /** Calendar date, `YYYY-MM-DD`. */
  date: string;
  count: number;
}

/**
 * A patient's food-diary history as their nutritionist sees it.
 * `hasAccount: false` and "linked but never used the diary" both return this
 * shape with empty arrays — the two are told apart by `hasAccount`, not by
 * an error (US-016).
 */
export interface ProfessionalFoodDiary {
  hasAccount: boolean;
  meals: Meal[];
  waterLogs: WaterLogEntry[];
}
