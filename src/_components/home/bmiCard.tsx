import { BmiBadge } from '@/_components/progress/bmiBadge';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/_components/ui/card';
import type { BmiClassification } from '@/_lib/bmi';
import { formatBmi } from '@/_lib/progressDisplay';
import { Activity } from 'lucide-react';

interface BmiCardProps {
  status: 'ready' | 'empty' | 'error';
  bmi?: number;
  classification?: BmiClassification;
}

export function BmiCard({ status, bmi, classification }: BmiCardProps) {
  return (
    <Card className="gap-3 border-line">
      <CardHeader className="grid-cols-[1fr_auto]">
        <CardTitle>IMC atual</CardTitle>
        <Activity className="size-5 text-icon-accent" aria-hidden="true" />
      </CardHeader>
      <CardContent className="flex flex-col gap-2">
        {status === 'ready' && bmi !== undefined && (
          <>
            <p className="text-3xl font-semibold">{formatBmi(bmi)}</p>
            {classification && <BmiBadge classification={classification} />}
          </>
        )}

        {status === 'empty' && (
          <p className="text-sm text-muted-foreground">
            Seu IMC aparece aqui assim que você registrar peso e altura.
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
