'use client';

import { acceptEmploymentInvitation } from '@/_actions/educatorEmployment/acceptEmploymentInvitation';
import { declineEmploymentInvitation } from '@/_actions/educatorEmployment/declineEmploymentInvitation';
import { Button } from '@/_components/ui/button';
import { useEmploymentInvitationMutation } from '@/_hooks/useEmploymentInvitationMutation';

interface InvitationDecisionActionsProps {
  invitationId: string;
  academiaName: string;
}

export function InvitationDecisionActions({
  invitationId,
  academiaName,
}: InvitationDecisionActionsProps) {
  const { run, isPending } = useEmploymentInvitationMutation();

  return (
    <div className="flex gap-2">
      <Button
        disabled={isPending}
        onClick={() =>
          run(
            () => acceptEmploymentInvitation({ id: invitationId }),
            `Convite de ${academiaName} aceito.`
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
            () => declineEmploymentInvitation({ id: invitationId }),
            `Convite de ${academiaName} recusado.`
          )
        }
      >
        Recusar
      </Button>
    </div>
  );
}
