import { Sparkline } from '@/_components/home/sparkline';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/_components/ui/card';
import { formatWeightVariation } from '@/_lib/progressDisplay';
import { Scale } from 'lucide-react';

interface WeightCardProps {
  status: 'ready' | 'empty' | 'error';
  weightKg?: number;
  weightVariationKg?: number | null;
  /** Série de pesos do mais antigo para o mais recente. */
  series?: number[];
}

export function WeightCard({
  status,
  weightKg,
  weightVariationKg,
  series = [],
}: WeightCardProps) {
  const variation =
    status === 'ready' &&
    weightVariationKg !== null &&
    weightVariationKg !== undefined
      ? formatWeightVariation(weightVariationKg)
      : null;

  return (
    <Card className="gap-3 border-line">
      <CardHeader className="grid-cols-[1fr_auto]">
        <CardTitle>Peso atual</CardTitle>
        <Scale className="size-5 text-icon-accent" aria-hidden="true" />
      </CardHeader>
      <CardContent>
        {status === 'ready' && weightKg !== undefined && (
          <>
            <p className="text-3xl font-semibold">
              {weightKg.toLocaleString('pt-BR')} kg
            </p>
            {variation && (
              <p
                className="mt-2 text-sm"
                style={{ color: variation.colorToken }}
              >
                {variation.text} desde o registro anterior
              </p>
            )}
            <div className="mt-3">
              <Sparkline values={series} />
            </div>
          </>
        )}

        {status === 'empty' && (
          <p className="text-sm text-muted-foreground">
            Você ainda não tem registros. Registre seu primeiro peso para
            acompanhar a evolução por aqui.
          </p>
        )}

        {status === 'error' && (
          <p className="text-sm text-muted-foreground">
            Não foi possível carregar seus dados agora. Tente de novo mais
            tarde.
          </p>
        )}
      </CardContent>
    </Card>
  );
}
