import { Fragment } from 'react';

export interface CohortRetentionGridProps {
  /** One label per row, e.g. "Nov/2025" — newest cohort first. */
  rowLabels: string[];
  /** Elapsed-month columns to render (≤ 12). */
  columnCount: number;
  /** [row][col], percent 0-100. `null` = not yet elapsed, never 0 (cohort-ltv-analysis US-001.EC-2). */
  cells: (number | null)[][];
}

/**
 * Cohort-month × months-since-signup retention grid. Adapts the CSS-grid +
 * `color-mix` intensity idiom from `checkInHeatmap.tsx`, but with a direct
 * linear 0-100% mapping (not that component's sqrt-of-raw-count formula,
 * which was tuned for unbounded counts, not bounded percentages) and
 * generic row/column counts instead of a fixed weekday×hour shape
 * (cohort-ltv-analysis ADR-008 — not a reuse of `CheckInHeatmap`).
 */
export function CohortRetentionGrid({
  rowLabels,
  columnCount,
  cells,
}: CohortRetentionGridProps) {
  return (
    <div
      role="img"
      aria-label="Grade de retenção por coorte de cadastro, em meses desde o cadastro."
      className="overflow-x-auto"
    >
      <div
        className="grid min-w-[640px] gap-[2px]"
        style={{
          gridTemplateColumns: `8rem repeat(${columnCount}, minmax(0,1fr))`,
        }}
      >
        <div />
        {Array.from({ length: columnCount }, (_, month) => (
          <div
            key={`month-${month}`}
            className="text-center text-[10px] text-muted-foreground"
          >
            {month}
          </div>
        ))}
        {rowLabels.map((label, row) => (
          <CohortRetentionRow
            key={`row-${row}`}
            label={label}
            columnCount={columnCount}
            percentages={cells[row] ?? []}
          />
        ))}
      </div>
    </div>
  );
}

interface CohortRetentionRowProps {
  label: string;
  columnCount: number;
  percentages: (number | null)[];
}

function CohortRetentionRow({
  label,
  columnCount,
  percentages,
}: CohortRetentionRowProps) {
  return (
    <Fragment>
      <div className="flex items-center text-xs text-muted-foreground">
        {label}
      </div>
      {Array.from({ length: columnCount }, (_, month) => (
        <CohortRetentionCell
          key={`cell-${label}-${month}`}
          percent={percentages[month] ?? null}
        />
      ))}
    </Fragment>
  );
}

function CohortRetentionCell({ percent }: { percent: number | null }) {
  if (percent === null) {
    return (
      <div
        aria-hidden="true"
        className="aspect-square rounded-sm border border-dashed border-muted-foreground/30"
      />
    );
  }

  const rounded = Math.round(percent);
  return (
    <div
      title={`${rounded}% retido`}
      className="flex aspect-square items-center justify-center rounded-sm text-[9px]"
      style={{
        backgroundColor:
          percent === 0
            ? 'var(--muted)'
            : `color-mix(in srgb, var(--primary) ${rounded}%, var(--muted))`,
      }}
    >
      {rounded}%
    </div>
  );
}
