'use client';

import { FormError } from '@/_components/students/formError';
import { Button } from '@/_components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/_components/ui/dialog';
import { useDayEditSave } from '@/_hooks/useDayEditSave';
import { blankMeal, fromMealPlanMeal } from '@/_lib/mealDrafts';
import { WEEKDAY_LABELS } from '@/_lib/mealPlanWeekdays';
import type { MealDraft } from '@/_types/mealDraft';
import type { MealPlanDay, MealPlanDraft, Weekday } from '@/_types/mealPlan';
import { useState } from 'react';
import { MealEditorRow } from './mealEditorRow';

interface MealListEditorProps {
  meals: MealDraft[];
  disabled: boolean;
  onChange: (meals: MealDraft[]) => void;
}

function MealListEditor({ meals, disabled, onChange }: MealListEditorProps) {
  return (
    <div className="flex flex-col gap-3">
      {meals.map(meal => (
        <MealEditorRow
          key={meal.key}
          meal={meal}
          disabled={disabled}
          onChange={next =>
            onChange(meals.map(m => (m.key === meal.key ? next : m)))
          }
          onRemove={() => onChange(meals.filter(m => m.key !== meal.key))}
        />
      ))}
      <Button
        type="button"
        variant="outline"
        disabled={disabled}
        onClick={() => onChange([...meals, blankMeal()])}
        className="w-fit"
      >
        Adicionar refeição
      </Button>
    </div>
  );
}

interface DayEditDialogProps {
  clientId: string;
  weekday: Weekday;
  day: MealPlanDay | null;
  triggerLabel: string;
  /** Optional: there is nothing left for a caller to do once saved — the
   * dialog already closes itself and `useDayEditSave` already refreshes the
   * page's server data. */
  onSaved?: (draft: MealPlanDraft) => void;
}

/** Edits one weekday's whole meal list, replacing it on save (US-012). */
export function DayEditDialog({
  clientId,
  weekday,
  day,
  triggerLabel,
  onSaved,
}: DayEditDialogProps) {
  const [open, setOpen] = useState(false);
  const [meals, setMeals] = useState<MealDraft[]>([]);
  const { save, isPending, error } = useDayEditSave({
    clientId,
    weekday,
    onSaved: draft => {
      setOpen(false);
      onSaved?.(draft);
    },
  });

  function openDialog(next: boolean) {
    setOpen(next);
    if (next) {
      const existing = day?.meals.map(fromMealPlanMeal) ?? [];
      setMeals(existing.length > 0 ? existing : [blankMeal()]);
    }
  }

  return (
    <Dialog open={open} onOpenChange={openDialog}>
      <DialogTrigger asChild>
        <Button type="button" variant="outline" size="sm">
          {triggerLabel}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[90dvh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{WEEKDAY_LABELS[weekday]}</DialogTitle>
        </DialogHeader>
        <form
          className="flex flex-col gap-4"
          onSubmit={event => {
            event.preventDefault();
            save(meals);
          }}
          noValidate
        >
          <MealListEditor
            meals={meals}
            disabled={isPending}
            onChange={setMeals}
          />
          <FormError message={error} />
          <Button type="submit" disabled={isPending} className="w-fit">
            {isPending ? 'Salvando…' : 'Salvar dia'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
