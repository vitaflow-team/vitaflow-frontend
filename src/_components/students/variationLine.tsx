import { describeVariation } from '@/_lib/assessmentDisplay';
import type { AssessmentVariation } from '@/_types/students';

interface VariationLineProps {
  variation: AssessmentVariation | null;
}

/** Changes since the first assessment; absent until there are two to compare. */
export function VariationLine({ variation }: VariationLineProps) {
  if (!variation) return null;

  return (
    <p className="text-sm text-muted-foreground">
      Desde a primeira avaliação — {describeVariation(variation).join(' · ')}
    </p>
  );
}
