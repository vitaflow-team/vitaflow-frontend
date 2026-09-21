import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/_components/ui/card';
import { buildSparkline } from '@/_lib/sparkline';
import { formatBmi, formatWeightVariation } from '@/_lib/progressDisplay';
import type { MeasurementRecordResponseDTO } from '@/_types/progress';
import { Activity, Ruler, Scale } from 'lucide-react';
import { BmiBadge } from './bmiBadge';
import { UpdateHeightButton } from './updateHeightButton';

interface SummaryCardsProps {
  latest: MeasurementRecordResponseDTO;
  weightVariationKg: number | null;
  /** Série do período selecionado — só a linha de tendência depende dela. */
  weightSeries: Array<{ recordedAt: string; weightKg: number }>;
}

const SPARKLINE_WIDTH = 64;
const SPARKLINE_HEIGHT = 20;

function formatRelativeDate(recordedAt: string) {
  const elapsedDays = Math.max(
    0,
    Math.floor((Date.now() - new Date(recordedAt).getTime()) / 86_400_000)
  );

  if (elapsedDays === 0) return 'Confirmada hoje';
  if (elapsedDays === 1) return 'Confirmada ontem';
  if (elapsedDays < 30) return `Confirmada há ${elapsedDays} dias`;

  const months = Math.floor(elapsedDays / 30);
  if (months < 12) {
    return `Confirmada há ${months} ${months === 1 ? 'mês' : 'meses'}`;
  }

  const years = Math.floor(months / 12);
  return `Confirmada há ${years} ${years === 1 ? 'ano' : 'anos'}`;
}

export function SummaryCards({
  latest,
  weightVariationKg,
  weightSeries,
}: SummaryCardsProps) {
  const variation =
    weightVariationKg === null
      ? null
      : formatWeightVariation(weightVariationKg);

  // Menos de dois registros no período não desenham tendência nenhuma.
  const sparkline = buildSparkline(
    weightSeries.map(point => point.weightKg),
    SPARKLINE_WIDTH,
    SPARKLINE_HEIGHT
  );

  return (
    <section
      aria-label="Resumo atual"
      className="grid grid-cols-3 gap-2 md:gap-4"
    >
      <Card className="min-w-0 gap-2 py-4 md:gap-3 md:py-6">
        <CardHeader className="grid-cols-[1fr_auto] items-center gap-1 px-3 md:px-6">
          <CardTitle className="text-xs md:text-base">Peso atual</CardTitle>
          <Scale
            className="size-4 text-icon-accent md:size-5"
            aria-hidden="true"
          />
        </CardHeader>
        <CardContent className="px-3 md:px-6">
          <p className="text-lg font-semibold md:text-3xl">
            {latest.weightKg.toLocaleString('pt-BR')} kg
          </p>
          {sparkline && (
            <svg
              aria-hidden="true"
              focusable="false"
              viewBox={`0 0 ${sparkline.width} ${sparkline.height}`}
              className="mt-1 h-5 w-full"
              preserveAspectRatio="none"
            >
              <path
                d={sparkline.path}
                fill="none"
                stroke="var(--icon-accent)"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
                vectorEffect="non-scaling-stroke"
              />
            </svg>
          )}
          {variation && (
            <p
              className="mt-1 text-[0.6875rem] leading-tight md:mt-2 md:text-sm"
              style={{ color: variation.colorToken }}
            >
              {variation.text}
              <span className="hidden md:inline">
                {' '}
                desde o registro anterior
              </span>
            </p>
          )}
        </CardContent>
      </Card>

      <Card className="min-w-0 gap-2 py-4 md:gap-3 md:py-6">
        <CardHeader className="grid-cols-[1fr_auto] items-center gap-1 px-3 md:px-6">
          <CardTitle className="text-xs md:text-base">IMC atual</CardTitle>
          <Activity
            className="size-4 text-icon-accent md:size-5"
            aria-hidden="true"
          />
        </CardHeader>
        <CardContent className="flex flex-wrap items-center gap-x-2 gap-y-1 px-3 md:px-6">
          <p className="text-lg font-semibold md:text-3xl">
            {formatBmi(latest.bmi)}
          </p>
          <BmiBadge classification={latest.bmiClassification} />
        </CardContent>
      </Card>

      <Card className="min-w-0 gap-2 py-4 md:gap-3 md:py-6">
        <CardHeader className="grid-cols-[1fr_auto] items-center gap-1 px-3 md:px-6">
          <CardTitle className="text-xs md:text-base">Altura atual</CardTitle>
          <Ruler
            className="size-4 text-icon-accent md:size-5"
            aria-hidden="true"
          />
        </CardHeader>
        <CardContent className="px-3 md:px-6">
          <p className="text-lg font-semibold md:text-3xl">
            {latest.heightCm.toLocaleString('pt-BR')} cm
          </p>
          <p className="mt-1 text-[0.6875rem] leading-tight text-muted-foreground md:mt-2 md:text-sm">
            {formatRelativeDate(latest.recordedAt)}
          </p>
          <UpdateHeightButton />
        </CardContent>
      </Card>
    </section>
  );
}
