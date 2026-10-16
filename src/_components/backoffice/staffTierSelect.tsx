'use client';

import { changeStaffTier } from '@/_actions/backoffice/changeStaffTier';
import { FormError } from '@/_components/students/formError';
import type { BackofficeTier } from '@/_types/backofficeStaff';
import { useRouter } from 'next/navigation';
import { useState, type ChangeEvent } from 'react';
import { useServerAction } from 'zsa-react';

interface StaffTierSelectProps {
  staffId: string;
  staffName: string;
  tier: BackofficeTier;
}

/** Promote/demote control (US-008); the backend rejects a last-admin demotion. */
export function StaffTierSelect({
  staffId,
  staffName,
  tier,
}: StaffTierSelectProps) {
  const router = useRouter();
  const action = useServerAction(changeStaffTier);
  const [error, setError] = useState<string | null>(null);

  async function handleChange(event: ChangeEvent<HTMLSelectElement>) {
    setError(null);
    const [, failure] = await action.execute({
      staffId,
      tier: event.target.value as BackofficeTier,
    });
    if (failure) {
      setError(failure.message);
      return;
    }
    router.refresh();
  }

  return (
    <div className="flex flex-col gap-1">
      <select
        defaultValue={tier}
        onChange={handleChange}
        disabled={action.isPending}
        className="h-9 rounded-md border border-input bg-background px-2 text-sm"
        aria-label={`Nível de acesso de ${staffName}`}
      >
        <option value="EQUIPE">Equipe</option>
        <option value="ADMIN">Admin interno</option>
      </select>
      <FormError message={error} />
    </div>
  );
}
