import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/_components/ui/card';
import type { EngajamentoHeatmapCell } from '@/_types/engajamento';
import { Fragment } from 'react';

const WEEKDAY_LABELS = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
const HOUR_LABEL_STEP = 3;

interface CheckInHeatmapProps {
  cells: EngajamentoHeatmapCell[];
}

/**
 * Weekday × hour grid of check-in counts. Color intensity uses a square-root
 * scale (not linear) so one unusually busy cell doesn't flatten every other
 * cell to near-zero opacity — a frontend-only decision, per `_techspec.md`'s
 * Known Risks (US-013 EC-2); the backend returns raw, zero-filled counts.
 */
export function CheckInHeatmap({ cells }: CheckInHeatmapProps) {
  const maxCount = Math.max(1, ...cells.map(cell => cell.count));
  const byKey = new Map(
    cells.map(cell => [`${cell.weekday}-${cell.hour}`, cell.count])
  );

  return (
    <Card className="min-w-0">
      <CardHeader>
        <CardTitle>Check-ins por dia e horário</CardTitle>
      </CardHeader>
      <CardContent>
        <div
          role="img"
          aria-label={`Mapa de calor de check-ins por dia da semana e horário, com pico de ${maxCount} check-ins em uma única hora.`}
          className="overflow-x-auto"
        >
          <CheckInHeatmapGrid byKey={byKey} maxCount={maxCount} />
        </div>
      </CardContent>
    </Card>
  );
}

interface CheckInHeatmapGridProps {
  byKey: Map<string, number>;
  maxCount: number;
}

function CheckInHeatmapGrid({ byKey, maxCount }: CheckInHeatmapGridProps) {
  return (
    <div className="grid min-w-[640px] grid-cols-[2.5rem_repeat(24,minmax(0,1fr))] gap-[2px]">
      <div />
      {Array.from({ length: 24 }, (_, hour) => (
        <div
          key={`hour-${hour}`}
          className="text-center text-[10px] text-muted-foreground"
        >
          {hour % HOUR_LABEL_STEP === 0 ? hour : ''}
        </div>
      ))}
      {WEEKDAY_LABELS.map((label, weekday) => (
        <Fragment key={`weekday-${weekday}`}>
          <div className="flex items-center text-xs text-muted-foreground">
            {label}
          </div>
          {Array.from({ length: 24 }, (_, hour) => (
            <CheckInHeatmapCell
              key={`cell-${weekday}-${hour}`}
              label={label}
              hour={hour}
              count={byKey.get(`${weekday}-${hour}`) ?? 0}
              maxCount={maxCount}
            />
          ))}
        </Fragment>
      ))}
    </div>
  );
}

interface CheckInHeatmapCellProps {
  label: string;
  hour: number;
  count: number;
  maxCount: number;
}

function CheckInHeatmapCell({
  label,
  hour,
  count,
  maxCount,
}: CheckInHeatmapCellProps) {
  const intensity = Math.sqrt(count) / Math.sqrt(maxCount);

  return (
    <div
      title={`${label} ${hour}h: ${count} check-in${count === 1 ? '' : 's'}`}
      className="aspect-square rounded-sm"
      style={{
        backgroundColor:
          count === 0
            ? 'var(--muted)'
            : `color-mix(in srgb, var(--primary) ${Math.round(intensity * 100)}%, var(--muted))`,
      }}
    />
  );
}
