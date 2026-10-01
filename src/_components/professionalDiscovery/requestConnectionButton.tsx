'use client';

import { requestConnection } from '@/_actions/professionalDiscovery/requestConnection';
import { Button } from '@/_components/ui/button';
import { useProfessionalDiscoveryMutation } from '@/_hooks/useProfessionalDiscoveryMutation';
import { useState } from 'react';

interface RequestConnectionButtonProps {
  professionalId: string;
  professionalName: string;
  hasPendingRequest: boolean;
}

/** US-004: request to connect with this professional. */
export function RequestConnectionButton({
  professionalId,
  professionalName,
  hasPendingRequest: initialHasPendingRequest,
}: RequestConnectionButtonProps) {
  const { run, isPending } = useProfessionalDiscoveryMutation();
  const [hasPendingRequest, setHasPendingRequest] = useState(
    initialHasPendingRequest
  );

  if (hasPendingRequest) {
    return (
      <p className="text-muted-foreground text-sm">
        Você já tem uma solicitação pendente para este profissional.
      </p>
    );
  }

  return (
    <Button
      disabled={isPending}
      onClick={async () => {
        const succeeded = await run(
          () => requestConnection({ professionalId }),
          `Solicitação enviada para ${professionalName}.`
        );
        if (succeeded) setHasPendingRequest(true);
      }}
    >
      Solicitar conexão
    </Button>
  );
}
