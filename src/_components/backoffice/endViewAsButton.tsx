'use client';

import { endViewAs } from '@/_actions/backoffice/endViewAs';
import { Button } from '@/_components/ui/button';
import { useAlertHook } from '@/_hooks/alertHook';
import { useRouter } from 'next/navigation';
import { useServerAction } from 'zsa-react';

interface EndViewAsButtonProps {
  sessionId: string;
}

/** Manual exit from an active "ver como" session (US-006). */
export function EndViewAsButton({ sessionId }: EndViewAsButtonProps) {
  const router = useRouter();
  const { openError } = useAlertHook();
  const { execute, isPending } = useServerAction(endViewAs);

  async function handleExit() {
    const [, error] = await execute({ sessionId });
    if (error) {
      openError(error.message, 'Atenção!', 'error');
    }
    router.push('/restrict/backoffice/accounts');
    router.refresh();
  }

  return (
    <Button
      type="button"
      variant="secondary"
      size="sm"
      disabled={isPending}
      onClick={handleExit}
    >
      {isPending ? 'Saindo...' : 'Encerrar "ver como"'}
    </Button>
  );
}
