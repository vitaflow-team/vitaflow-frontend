'use client';

import { actionDeleteMeal } from '@/_actions/foodDiary/deleteMeal';
import { actionUpdateMeal } from '@/_actions/foodDiary/updateMeal';
import { Button } from '@/_components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/_components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from '@/_components/ui/form';
import { Input } from '@/_components/ui/input';
import { useAlertHook } from '@/_hooks/alertHook';
import { zodResolverFixed } from '@/_lib/zodResolverHelper';
import { updateMealFormData, updateMealSchema } from '@/_schema/foodDiary';
import type { Meal } from '@/_types/foodDiary';
import { Pencil, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useServerAction } from 'zsa-react';
import { MEAL_TYPE_LABELS } from './mealTypeLabels';

interface MealItemProps {
  meal: Meal;
}

export function MealItem({ meal }: MealItemProps) {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const { openError } = useAlertHook();
  const { isPending: isSaving, execute: save } =
    useServerAction(actionUpdateMeal);
  const { isPending: isDeleting, execute: remove } =
    useServerAction(actionDeleteMeal);

  const methods = useForm<updateMealFormData>({
    resolver: zodResolverFixed(updateMealSchema),
    defaultValues: {
      mealId: meal.id,
      description: meal.description,
      calories: meal.calories,
    },
  });

  async function submit(data: updateMealFormData) {
    const [, error] = await save(data);
    if (error) {
      openError(error.message, 'Não foi possível salvar', 'error');
      return;
    }
    setOpen(false);
    router.refresh();
  }

  async function handleDelete() {
    const [, error] = await remove({ mealId: meal.id });
    if (error) {
      openError(error.message, 'Não foi possível remover', 'error');
      return;
    }
    router.refresh();
  }

  return (
    <li className="flex items-center justify-between gap-2 rounded-md border border-line px-3 py-2">
      <div>
        <p className="text-sm font-medium">{meal.description}</p>
        <p className="text-xs text-muted-foreground">
          {MEAL_TYPE_LABELS[meal.mealType]} ·{' '}
          {meal.calories.toLocaleString('pt-BR')} kcal (estimativa)
        </p>
      </div>
      <div className="flex gap-1">
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              aria-label="Editar refeição"
            >
              <Pencil className="size-4" aria-hidden="true" />
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Editar refeição</DialogTitle>
            </DialogHeader>
            <Form {...methods}>
              <form
                onSubmit={methods.handleSubmit(submit)}
                className="flex flex-col gap-3"
              >
                <FormField
                  control={methods.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Descrição</FormLabel>
                      <FormControl>
                        <Input id="description" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={methods.control}
                  name="calories"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Calorias (estimativa)</FormLabel>
                      <FormControl>
                        <Input id="calories" type="number" min={1} {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <DialogFooter>
                  <Button type="submit" disabled={isSaving}>
                    Salvar
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          aria-label="Remover refeição"
          disabled={isDeleting}
          onClick={handleDelete}
        >
          <Trash2 className="size-4" aria-hidden="true" />
        </Button>
      </div>
    </li>
  );
}
