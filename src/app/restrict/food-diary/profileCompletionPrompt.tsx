'use client';

import { actionCompleteProfile } from '@/_actions/foodDiary/completeProfile';
import { Button } from '@/_components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/_components/ui/card';
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
import {
  completeProfileFormData,
  completeProfileSchema,
} from '@/_schema/foodDiary';
import type { MissingProfileField } from '@/_types/foodDiary';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useServerAction } from 'zsa-react';

interface ProfileCompletionPromptProps {
  missingFields: MissingProfileField[];
}

/** Only rendered when `getMissingProfileFields` actually returns something
 * (US-005) — never shown unconditionally. Weight/height are always asked
 * here too, since they drive the calorie goal the same way sex/goal do,
 * even though they live on MeasurementRecord, not FitnessProfile. */
export function ProfileCompletionPrompt({
  missingFields,
}: ProfileCompletionPromptProps) {
  const [dismissed, setDismissed] = useState(false);
  const router = useRouter();
  const { openError } = useAlertHook();
  const { isPending, execute } = useServerAction(actionCompleteProfile);

  const methods = useForm<completeProfileFormData>({
    resolver: zodResolverFixed(completeProfileSchema),
    defaultValues: {},
  });

  if (dismissed || missingFields.length === 0) return null;

  async function submit(data: completeProfileFormData) {
    const [, error] = await execute(data);
    if (error) {
      openError(error.message, 'Não foi possível salvar', 'error');
      return;
    }
    setDismissed(true);
    router.refresh();
  }

  return (
    <Card className="border-dashed">
      <CardHeader>
        <CardTitle>Complete seu perfil para ver sua meta calórica</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...methods}>
          <form
            onSubmit={methods.handleSubmit(submit)}
            className="flex flex-col gap-3"
          >
            <div className="grid grid-cols-2 gap-3">
              {missingFields.includes('sex') && (
                <FormField
                  control={methods.control}
                  name="sex"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Sexo</FormLabel>
                      <FormControl>
                        <select
                          id="sex"
                          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                          value={field.value ?? ''}
                          onChange={event => field.onChange(event.target.value)}
                        >
                          <option value="" disabled>
                            Selecione
                          </option>
                          <option value="MALE">Masculino</option>
                          <option value="FEMALE">Feminino</option>
                        </select>
                      </FormControl>
                    </FormItem>
                  )}
                />
              )}

              {missingFields.includes('goal') && (
                <FormField
                  control={methods.control}
                  name="goal"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Objetivo</FormLabel>
                      <FormControl>
                        <select
                          id="goal"
                          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                          value={field.value ?? ''}
                          onChange={event => field.onChange(event.target.value)}
                        >
                          <option value="" disabled>
                            Selecione
                          </option>
                          <option value="WEIGHT_LOSS">Emagrecimento</option>
                          <option value="MUSCLE_GAIN">Ganho de massa</option>
                          <option value="CONDITIONING">Condicionamento</option>
                          <option value="MAINTENANCE">Manutenção</option>
                        </select>
                      </FormControl>
                    </FormItem>
                  )}
                />
              )}

              <FormField
                control={methods.control}
                name="weightKg"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Peso (kg)</FormLabel>
                    <FormControl>
                      <Input
                        id="weightKg"
                        type="number"
                        step="0.1"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={methods.control}
                name="heightCm"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Altura (cm)</FormLabel>
                    <FormControl>
                      <Input
                        id="heightCm"
                        type="number"
                        step="0.1"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            <div className="flex gap-2 justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={() => setDismissed(true)}
              >
                Agora não
              </Button>
              <Button type="submit" disabled={isPending}>
                Salvar
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
