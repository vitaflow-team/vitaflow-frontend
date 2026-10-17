'use client';

import { saveDay } from '@/_actions/mealPlan/saveDay';
import { isBlankMeal, toMealInput } from '@/_lib/mealDrafts';
import type { MealDraft } from '@/_types/mealDraft';
import type { MealPlanDraft, Weekday } from '@/_types/mealPlan';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useServerAction } from 'zsa-react';

interface UseDayEditSaveInput {
  clientId: string;
  weekday: Weekday;
  onSaved: (draft: MealPlanDraft) => void;
}

export function useDayEditSave({
  clientId,
  weekday,
  onSaved,
}: UseDayEditSaveInput) {
  const router = useRouter();
  const { execute, isPending } = useServerAction(saveDay);
  const [error, setError] = useState<string | null>(null);

  async function save(meals: MealDraft[]) {
    setError(null);
    const [draft, actionError] = await execute({
      clientId,
      weekday,
      meals: meals.filter(meal => !isBlankMeal(meal)).map(toMealInput),
    });
    if (actionError) {
      setError(actionError.message);
      return;
    }
    router.refresh();
    if (draft) onSaved(draft);
  }

  return { save, isPending, error };
}
