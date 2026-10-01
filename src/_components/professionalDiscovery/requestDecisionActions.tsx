'use client';

import { acceptRequest } from '@/_actions/professionalDiscovery/acceptRequest';
import { declineRequest } from '@/_actions/professionalDiscovery/declineRequest';
import { Button } from '@/_components/ui/button';
import { useProfessionalDiscoveryMutation } from '@/_hooks/useProfessionalDiscoveryMutation';

interface RequestDecisionActionsProps {
  requestId: string;
  requesterName: string;
}

/** Accept or decline one incoming request (US-008, US-009). */
export function RequestDecisionActions({
  requestId,
  requesterName,
}: RequestDecisionActionsProps) {
  const { run, isPending } = useProfessionalDiscoveryMutation();

  return (
    <div className="flex gap-2">
      <Button
        disabled={isPending}
        onClick={() =>
          run(
            () => acceptRequest({ id: requestId }),
            `Solicitação de ${requesterName} aceita.`
          )
        }
      >
        Aceitar
      </Button>
      <Button
        type="button"
        variant="outline"
        disabled={isPending}
        onClick={() =>
          run(
            () => declineRequest({ id: requestId }),
            `Solicitação de ${requesterName} recusada.`
          )
        }
      >
        Recusar
      </Button>
    </div>
  );
}
