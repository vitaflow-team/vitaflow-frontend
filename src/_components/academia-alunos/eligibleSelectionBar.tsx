import { Button } from '@/_components/ui/button';

interface EligibleSelectionBarProps {
  selectedCount: number;
  total: number;
  disabled: boolean;
  onSelectAll: () => void;
  onClear: () => void;
}

/** How many students are selected, announced politely, and the whole selection one click away. */
export function EligibleSelectionBar({
  selectedCount,
  total,
  disabled,
  onSelectAll,
  onClear,
}: EligibleSelectionBarProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-2">
      <span className="text-sm" aria-live="polite">
        {selectedCount} de {total} selecionados
      </span>
      <div className="flex gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={disabled}
          onClick={onSelectAll}
        >
          Selecionar todos
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={disabled}
          onClick={onClear}
        >
          Limpar
        </Button>
      </div>
    </div>
  );
}
