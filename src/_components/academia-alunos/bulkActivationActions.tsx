import { Button } from '@/_components/ui/button';
import { DueDaySelect } from './dueDaySelect';

interface BulkActivationActionsProps {
  dueDay: number;
  onDueDayChange: (dueDay: number) => void;
  selectedCount: number;
  busy: boolean;
  running: boolean;
  onRun: () => void;
}

/** One due day for the whole selection, and the button that starts the activation. */
export function BulkActivationActions({
  dueDay,
  onDueDayChange,
  selectedCount,
  busy,
  running,
  onRun,
}: BulkActivationActionsProps) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-3">
      <DueDaySelect
        id="bulk-due-day"
        label="Dia de vencimento"
        value={dueDay}
        disabled={busy}
        onChange={day => onDueDayChange(day ?? dueDay)}
      />
      <Button
        type="button"
        disabled={busy || selectedCount === 0}
        aria-busy={running}
        onClick={onRun}
      >
        {running ? 'Ativando…' : 'Ativar selecionados'}
      </Button>
    </div>
  );
}
