import { Button } from '@/_components/ui/button';
import { checkinNoticeMessage } from '@/_lib/checkinNotice';
import type { CheckinConfirmation } from '@/_types/checkinConfirmation';

function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
  });
}

interface CheckinConfirmedProps {
  confirmation: CheckinConfirmation;
  onReset: () => void;
}

/**
 * The confirmed check-in, and next to it the neutral notice when there is
 * one: no amount, no days and no wording about debt, ever (ADR-005, US-019).
 */
export function CheckinConfirmed({
  confirmation,
  onReset,
}: CheckinConfirmedProps) {
  return (
    <>
      <p className="text-sm text-muted-foreground" role="status">
        Check-in registrado às {formatTime(confirmation.createdAt)}.
      </p>
      {confirmation.notice && (
        <p className="text-sm font-medium" role="status">
          {checkinNoticeMessage(confirmation.notice)}
        </p>
      )}
      <Button type="button" onClick={onReset}>
        Buscar outro aluno
      </Button>
    </>
  );
}
