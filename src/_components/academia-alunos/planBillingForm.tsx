'use client';

import { FormError } from '@/_components/students/formError';
import { Button } from '@/_components/ui/button';
import { usePlanAssign } from '@/_hooks/usePlanAssign';
import { availabilityHint } from '@/_lib/gymBillingAvailability';
import type { AcademiaAccessPlan } from '@/_types/academia';
import type { GymBillingAvailability } from '@/_types/gymBillingAvailability';
import { BillingFields } from './billingFields';

interface PlanBillingFormProps {
  clientId: string;
  plan: AcademiaAccessPlan;
  availability: GymBillingAvailability;
  onAssigned: () => void;
}

/** Links the chosen plan, optionally starting the monthly fee (US-012). */
export function PlanBillingForm({
  clientId,
  plan,
  availability,
  onAssigned,
}: PlanBillingFormProps) {
  const form = usePlanAssign({ clientId, plan, availability, onAssigned });
  const hint = availabilityHint(availability);

  return (
    <form
      onSubmit={event => void form.submit(event)}
      className="flex flex-col gap-3 rounded-lg border p-3"
    >
      <p className="text-sm font-medium">{plan.name}</p>
      {hint ? (
        <p className="text-muted-foreground text-sm">{hint}</p>
      ) : (
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={form.billingOn}
            disabled={form.isPending}
            onChange={event => form.setBillingOn(event.target.checked)}
          />
          Cobrar mensalidade deste aluno
        </label>
      )}
      {form.billingOn && (
        <BillingFields
          values={form.values}
          onChange={form.setValues}
          needsTaxId={form.needsTaxId}
          disabled={form.isPending}
        />
      )}
      <FormError message={form.error} />
      <Button type="submit" disabled={form.isPending}>
        {form.isPending ? 'Salvando…' : 'Vincular plano'}
      </Button>
    </form>
  );
}
