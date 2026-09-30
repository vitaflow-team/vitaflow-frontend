'use client';

import { actionEstimateCalories } from '@/_actions/foodDiary/estimateCalories';
import { actionLogMeal } from '@/_actions/foodDiary/logMeal';
import { Button } from '@/_components/ui/button';
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
import { logMealFormData, logMealSchema } from '@/_schema/foodDiary';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { useServerAction } from 'zsa-react';
import { MEAL_TYPE_LABELS } from './mealTypeLabels';

export function MealLoggingForm() {
  const methods = useForm<logMealFormData>({
    resolver: zodResolverFixed(logMealSchema),
    defaultValues: { mealType: 'LUNCH', description: '', calories: 0 },
  });
  const { isPending: isEstimating, execute: estimate } = useServerAction(
    actionEstimateCalories
  );
  const { isPending: isSaving, execute: save } = useServerAction(actionLogMeal);
  const { openError } = useAlertHook();
  const router = useRouter();

  async function handleEstimate() {
    const description = methods.getValues('description');
    if (!description.trim()) {
      methods.setError('description', {
        message: 'Descreva a refeição primeiro.',
      });
      return;
    }

    const [result, error] = await estimate({ description });
    if (error) {
      // Estimate failure (US-001 EC-3): falls back to manual entry — the
      // field simply stays editable, never blocks logging.
      openError(error.message, 'Estimativa indisponível', 'warning');
      return;
    }
    methods.setValue('calories', result.calories, { shouldValidate: true });
  }

  async function submit(data: logMealFormData) {
    const [, error] = await save(data);
    if (error) {
      openError(error.message, 'Não foi possível registrar', 'error');
      return;
    }
    methods.reset({ mealType: data.mealType, description: '', calories: 0 });
    router.refresh();
  }

  return (
    <Form {...methods}>
      <form
        onSubmit={methods.handleSubmit(submit)}
        className="flex flex-col gap-3 rounded-lg border border-line p-4"
      >
        <FormField
          control={methods.control}
          name="mealType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Refeição</FormLabel>
              <FormControl>
                <select
                  id="mealType"
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  value={field.value}
                  onChange={event => field.onChange(event.target.value)}
                >
                  {Object.entries(MEAL_TYPE_LABELS).map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={methods.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>O que você comeu?</FormLabel>
              <FormControl>
                <Input
                  id="description"
                  placeholder="Ex.: 1 banana e 2 ovos mexidos"
                  {...field}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <div className="flex items-end gap-2">
          <FormField
            control={methods.control}
            name="calories"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>Calorias (estimativa, editável)</FormLabel>
                <FormControl>
                  <Input id="calories" type="number" min={1} {...field} />
                </FormControl>
              </FormItem>
            )}
          />
          <Button
            type="button"
            variant="outline"
            disabled={isEstimating}
            onClick={handleEstimate}
          >
            {isEstimating ? 'Estimando…' : 'Estimar'}
          </Button>
        </div>

        <Button type="submit" disabled={isSaving}>
          Registrar refeição
        </Button>
      </form>
    </Form>
  );
}
