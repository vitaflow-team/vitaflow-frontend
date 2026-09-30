import type { Meal } from '@/_types/foodDiary';
import { MealItem } from './mealItem';

interface MealListProps {
  meals: Meal[];
}

export function MealList({ meals }: MealListProps) {
  if (meals.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        Nenhuma refeição registrada ainda hoje.
      </p>
    );
  }

  return (
    <ul className="flex flex-col gap-2">
      {meals.map(meal => (
        <MealItem key={meal.id} meal={meal} />
      ))}
    </ul>
  );
}
