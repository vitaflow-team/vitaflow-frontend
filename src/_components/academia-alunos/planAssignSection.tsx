'use client';

import { Button } from '@/_components/ui/button';
import type { AcademiaAccessPlan } from '@/_types/academia';
import type { GymBillingAvailability } from '@/_types/gymBillingAvailability';
import { useState } from 'react';
import { PlanBillingForm } from './planBillingForm';

interface PlanAssignSectionProps {
  clientId: string;
  catalog: AcademiaAccessPlan[];
  hasPlan: boolean;
  availability: GymBillingAvailability;
  onAssigned: () => void;
}

/** The catalog to pick from; choosing a plan opens its fee terms before anything is saved. */
export function PlanAssignSection({
  clientId,
  catalog,
  hasPlan,
  availability,
  onAssigned,
}: PlanAssignSectionProps) {
  const [chosen, setChosen] = useState<AcademiaAccessPlan | null>(null);

  return (
    <div className="flex flex-col gap-2">
      <span className="text-sm font-medium">
        {hasPlan ? 'Trocar plano' : 'Atribuir plano'}
      </span>
      {catalog.map(plan => (
        <Button
          key={plan.id}
          type="button"
          variant={chosen?.id === plan.id ? 'default' : 'outline'}
          aria-pressed={chosen?.id === plan.id}
          className="w-full justify-start"
          onClick={() => setChosen(plan)}
        >
          {plan.name}
        </Button>
      ))}
      {chosen && (
        <PlanBillingForm
          key={chosen.id}
          clientId={clientId}
          plan={chosen}
          availability={availability}
          onAssigned={() => {
            setChosen(null);
            onAssigned();
          }}
        />
      )}
    </div>
  );
}
