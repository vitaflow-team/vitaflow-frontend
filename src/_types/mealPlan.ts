export type Weekday =
  | 'MONDAY'
  | 'TUESDAY'
  | 'WEDNESDAY'
  | 'THURSDAY'
  | 'FRIDAY'
  | 'SATURDAY'
  | 'SUNDAY';

export interface MealPlanMeal {
  id: string;
  label: string;
  text: string;
}

export interface MealPlanDay {
  id: string;
  weekday: Weekday;
  meals: MealPlanMeal[];
}

export interface MealPlanDraft {
  id: string;
  days: MealPlanDay[];
}

export interface MealPlanVersion {
  version: number;
  publishedAt: string;
}
