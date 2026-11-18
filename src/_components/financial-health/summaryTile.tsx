import { formatChange } from '@/_lib/financialHealthDisplay';

interface SummaryTileProps {
  id: string;
  label: string;
  hint: string;
  value: string;
  change: number | null;
}

function changeText(change: number | null): string {
  if (change === null) return formatChange(null);
  return `${formatChange(change)} em relação ao mês anterior`;
}

/** One money figure: its label names the group, so a screen reader reads label then value. */
export function SummaryTile({
  id,
  label,
  hint,
  value,
  change,
}: SummaryTileProps) {
  const labelId = `${id}-label`;

  return (
    <div
      role="group"
      aria-labelledby={labelId}
      className="flex min-w-0 flex-col gap-1 rounded-lg border p-4"
    >
      <span id={labelId} className="text-sm font-medium">
        {label}
      </span>
      <span className="text-2xl font-semibold tracking-tight break-words">
        {value}
      </span>
      <span className="text-muted-foreground text-xs">{hint}</span>
      <span className="text-muted-foreground text-xs">
        {changeText(change)}
      </span>
    </div>
  );
}
