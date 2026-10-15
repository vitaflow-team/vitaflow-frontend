'use client';

import { selfCheckIn } from '@/_actions/checkin/selfCheckIn';
import { Button } from '@/_components/ui/button';
import { FormError } from '@/_components/students/formError';
import { ScanLine } from 'lucide-react';
import { useState } from 'react';
import { useServerAction } from 'zsa-react';

function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function SelfCheckInCard() {
  const action = useServerAction(selfCheckIn);
  const [confirmedAt, setConfirmedAt] = useState<string | null>(null);

  async function handleCheckIn() {
    setConfirmedAt(null);
    const [result, error] = await action.execute();
    if (!error && result) {
      setConfirmedAt(result.createdAt);
    }
  }

  return (
    <section
      aria-label="Check-in na academia"
      className="bg-card flex flex-col items-start gap-3 rounded-lg border p-4"
    >
      <Button
        type="button"
        disabled={action.isPending}
        onClick={() => void handleCheckIn()}
      >
        <ScanLine aria-hidden="true" />
        {action.isPending ? 'Registrando...' : 'Fazer check-in'}
      </Button>
      {confirmedAt && (
        <p className="text-sm text-muted-foreground" role="status">
          Check-in registrado às {formatTime(confirmedAt)}.
        </p>
      )}
      <FormError message={action.isError ? action.error.message : null} />
    </section>
  );
}
