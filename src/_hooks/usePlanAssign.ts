import { assignAccessPlan } from '@/_actions/academia/assignAccessPlan';
import {
  centsToAmountInput,
  defaultDueDay,
  planPriceCents,
} from '@/_lib/gymBillingForm';
import { submitPlanAssign } from '@/_lib/planAssignSubmit';
import { todayInBrazil } from '@/_lib/studentsDates';
import type { AcademiaAccessPlan } from '@/_types/academia';
import type { BillingFormValues } from '@/_types/billingFormValues';
import type { GymBillingAvailability } from '@/_types/gymBillingAvailability';
import { useState, type FormEvent } from 'react';
import { useServerAction } from 'zsa-react';

interface UsePlanAssignParams {
  clientId: string;
  plan: AcademiaAccessPlan;
  availability: GymBillingAvailability;
  onAssigned: () => void;
}

/** The state and submit of linking one catalog plan, with or without the monthly fee. */
export function usePlanAssign({
  clientId,
  plan,
  availability,
  onAssigned,
}: UsePlanAssignParams) {
  const priceCents = planPriceCents(plan.referencePrice);
  const { execute, isPending } = useServerAction(assignAccessPlan);
  const [billingOn, setBillingOn] = useState(
    availability === 'READY' && priceCents > 0
  );
  const [values, setValues] = useState<BillingFormValues>(() => ({
    dueDay: defaultDueDay(todayInBrazil()),
    amountText: centsToAmountInput(priceCents),
    cpfCnpj: '',
  }));
  const [needsTaxId, setNeedsTaxId] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(event: FormEvent) {
    event.preventDefault();
    const outcome = await submitPlanAssign(execute, {
      clientId,
      accessPlanId: plan.id,
      billing: billingOn ? values : null,
    });
    if (outcome.done) return onAssigned();
    setError(outcome.message);
    setNeedsTaxId(needsTaxId || outcome.needsTaxId);
  }

  return {
    billingOn,
    setBillingOn,
    values,
    setValues,
    needsTaxId,
    error,
    isPending,
    submit,
  };
}
