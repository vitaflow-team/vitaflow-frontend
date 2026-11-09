'use client';

import { dismissChurnRisk } from '@/_actions/academia-engajamento/dismissChurnRisk';
import { Button } from '@/_components/ui/button';
import { useAlertHook } from '@/_hooks/alertHook';
import { useRouter } from 'next/navigation';
import { useServerAction } from 'zsa-react';

interface DismissChurnRiskButtonProps {
  clientId: string;
}

// A dismissed student isn't permanently exempt — they can be flagged again
// if they relapse into a genuinely new risk episode (US-005.AC-2), so this
// mirrors the no-confirmation inline-action pattern used for reversible
// dashboard actions (e.g. InvitationDecisionActions), not the
// AlertDialog-confirmed pattern reserved for irreversible removals (e.g.
// RemoveTurmaButton, RemoveStaffButton).
export function DismissChurnRiskButton({
  clientId,
}: DismissChurnRiskButtonProps) {
  const router = useRouter();
  const { openError } = useAlertHook();
  const { execute, isPending } = useServerAction(dismissChurnRisk);

  async function handleDismiss() {
    const [, error] = await execute({ clientId });
    if (error) {
      openError(error.message, 'Atenção!', 'error');
      return;
    }
    router.refresh();
  }

  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      disabled={isPending}
      onClick={() => void handleDismiss()}
      data-testid={`dismiss-churn-risk-${clientId}`}
    >
      Dispensar
    </Button>
  );
}
