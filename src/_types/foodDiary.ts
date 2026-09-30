export type MealType = 'BREAKFAST' | 'LUNCH' | 'DINNER' | 'SNACK';

export interface Meal {
  id: string;
  mealType: MealType;
  description: string;
  calories: number;
  loggedAt: string;
}

export interface DailySummary {
  meals: Meal[];
  totalCalories: number;
  goal: number | null;
  waterCount: number;
  streak: number;
}

export type MissingProfileField = 'sex' | 'goal';
