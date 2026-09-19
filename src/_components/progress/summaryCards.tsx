import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/_components/ui/card';
import { formatWeightVariation } from '@/_lib/progressDisplay';
import type { MeasurementRecordResponseDTO } from '@/_types/progress';
import { Activity, Ruler, Scale } from 'lucide-react';
import { BmiBadge } from './bmiBadge';

interface SummaryCardsProps {
  latest: MeasurementRecordResponseDTO;
  weightVariationKg: number | null;
}

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

export function SummaryCards({ latest, weightVariationKg }: SummaryCardsProps) {
  const variation =
    weightVariationKg === null
      ? null
      : formatWeightVariation(weightVariationKg);

  return (
    <section
      aria-label="Resumo atual"
      className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3"
    >
      <Card className="gap-3">
        <CardHeader className="grid-cols-[1fr_auto]">
          <CardTitle>Peso atual</CardTitle>
          <Scale className="size-5 text-icon-accent" aria-hidden="true" />
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-semibold">
            {latest.weightKg.toLocaleString('pt-BR')} kg
          </p>
          {variation && (
            <p className="mt-2 text-sm" style={{ color: variation.colorToken }}>
              {variation.text} desde o registro anterior
            </p>
          )}
        </CardContent>
      </Card>

      <Card className="gap-3">
        <CardHeader className="grid-cols-[1fr_auto]">
          <CardTitle>IMC atual</CardTitle>
          <Activity className="size-5 text-icon-accent" aria-hidden="true" />
        </CardHeader>
        <CardContent className="flex flex-col gap-2">
          <p className="text-3xl font-semibold">
            {latest.bmi.toLocaleString('pt-BR', {
              minimumFractionDigits: 1,
              maximumFractionDigits: 1,
            })}
          </p>
          <BmiBadge classification={latest.bmiClassification} />
        </CardContent>
      </Card>

      <Card className="gap-3 sm:col-span-2 xl:col-span-1">
        <CardHeader className="grid-cols-[1fr_auto]">
          <CardTitle>Altura atual</CardTitle>
          <Ruler className="size-5 text-icon-accent" aria-hidden="true" />
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-semibold">
            {latest.heightCm.toLocaleString('pt-BR')} cm
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            {formatRelativeDate(latest.recordedAt)}
          </p>
        </CardContent>
      </Card>
    </section>
  );
}
