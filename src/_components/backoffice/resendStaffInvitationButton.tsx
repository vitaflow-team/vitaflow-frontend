'use client';

import { resendStaffInvitation } from '@/_actions/backoffice/resendStaffInvitation';
import { Button } from '@/_components/ui/button';
import { useAlertHook } from '@/_hooks/alertHook';
import { useRouter } from 'next/navigation';
import { useServerAction } from 'zsa-react';

interface ResendStaffInvitationButtonProps {
  staffId: string;
  staffName: string;
}

/** Sends a pending invitation again; the previous link stops working. */
export function ResendStaffInvitationButton({
  staffId,
  staffName,
}: ResendStaffInvitationButtonProps) {
  const router = useRouter();
  const { openError } = useAlertHook();
  const { execute, isPending } = useServerAction(resendStaffInvitation);

  async function handleResend() {
    const [, error] = await execute({ staffId });
    if (error) {
      openError(error.message, 'Atenção!', 'error');
      router.refresh();
      return;
    }
    openError('Convite reenviado.', 'Pronto!', 'success');
  }

  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      disabled={isPending}
      onClick={handleResend}
      aria-label={`Reenviar convite para ${staffName}`}
    >
      {isPending ? 'Reenviando...' : 'Reenviar convite'}
    </Button>
  );
}
