import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/_components/ui/card';
import type { AdherenceSummaryDTO } from '@/_types/progress';

interface AdherenceCardProps {
  adherence: AdherenceSummaryDTO;
}

export function AdherenceCard({ adherence }: AdherenceCardProps) {
  return (
    <Card className="min-w-0">
      <CardHeader>
        <CardTitle className="text-base">Adesão</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        <div>
          <p className="text-sm text-muted-foreground">Diário alimentar</p>
          <p className="text-2xl font-semibold">
            {adherence.diaryPercent.toLocaleString('pt-BR', {
              maximumFractionDigits: 1,
            })}
            %
          </p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Treino</p>
          {adherence.workoutTrackingUnavailable ? (
            <p className="text-sm text-muted-foreground">
              Ainda não é possível medir a adesão ao treino.
              {adherence.hasWorkoutPlan
                ? ' Você tem um plano de treino ativo.'
                : ' Você ainda não tem um plano de treino.'}
            </p>
          ) : (
            <p className="text-2xl font-semibold">
              {adherence.workoutPercent}%
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
