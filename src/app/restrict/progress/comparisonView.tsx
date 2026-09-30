import { Card, CardContent } from '@/_components/ui/card';
import type { CompareResult } from '@/_types/progressPhotos';
import Link from 'next/link';

interface ComparisonViewProps {
  result: CompareResult;
  angle: string;
}

// Side-by-side comparison (US-004) — always between two photos of the same
// angle, both already served via signed URLs by the backend (ADR-001).
export function ComparisonView({ result, angle }: ComparisonViewProps) {
  return (
    <Card>
      <CardContent className="flex flex-col gap-4">
        <div className="grid grid-cols-2 gap-3">
          {[result.a, result.b].map(photo => (
            <div key={photo.id} className="flex flex-col gap-1">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={photo.signedUrl}
                alt={`Foto de ${new Date(photo.takenAt).toLocaleDateString('pt-BR')}`}
                className="aspect-3/4 w-full rounded-lg object-cover"
              />
              <p className="text-center text-xs text-muted-foreground">
                {new Date(photo.takenAt).toLocaleDateString('pt-BR')}
              </p>
            </div>
          ))}
        </div>
        <Link
          href={`/restrict/progress?tab=fotos&angle=${angle}`}
          className="self-start text-sm text-muted-foreground underline"
        >
          Voltar ao histórico
        </Link>
      </CardContent>
    </Card>
  );
}
