interface MetricTileTrend {
  label: string;
  tone: 'positive' | 'negative' | 'neutral' | 'unavailable';
}

interface MetricTileProps {
  label: string;
  value: string;
  /** Omitted entirely when there is nothing to compare against — never a false "0%" (task_02, UT-022). */
  trend?: MetricTileTrend;
}

const TREND_COLOR: Record<MetricTileTrend['tone'], string> = {
  positive: 'var(--chart-2)',
  negative: 'var(--destructive)',
  neutral: 'var(--muted-foreground)',
  unavailable: 'var(--muted-foreground)',
};

/**
 * The repo's first generic stat tile (label + value + optional trend) —
 * built for the metrics screen's volume of KPIs (TechSpec Component
 * Overview). Intentionally generic: no business logic, no formatting
 * decisions — callers pass already-formatted strings.
 */
export function MetricTile({ label, value, trend }: MetricTileProps) {
  return (
    <div className="flex min-w-0 flex-col gap-1">
      <span className="text-muted-foreground text-xs">{label}</span>
      <span className="text-xl font-semibold tracking-tight">{value}</span>
      {trend && (
        <span
          className={
            trend.tone === 'unavailable'
              ? 'text-xs italic'
              : 'text-xs font-medium'
          }
          style={{ color: TREND_COLOR[trend.tone] }}
        >
          {trend.label}
        </span>
      )}
    </div>
  );
}
