import type { MealPlanMeal } from '@/_types/mealPlan';
import type { MealDraft } from '@/_types/mealDraft';

export function blankMeal(): MealDraft {
  return { key: crypto.randomUUID(), label: '', text: '' };
}

export function fromMealPlanMeal(meal: MealPlanMeal): MealDraft {
  return { key: crypto.randomUUID(), label: meal.label, text: meal.text };
}

export function toMealInput(draft: MealDraft) {
  return { label: draft.label.trim(), text: draft.text.trim() };
}

/** A row with neither a name nor a description is dropped, never saved blank. */
export function isBlankMeal(draft: MealDraft): boolean {
  return draft.label.trim() === '' && draft.text.trim() === '';
}
