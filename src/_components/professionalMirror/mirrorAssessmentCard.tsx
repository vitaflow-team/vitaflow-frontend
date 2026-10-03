import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/_components/ui/card';
import { formatMeasure } from '@/_lib/assessmentDisplay';
import { formatIsoDay } from '@/_lib/studentsDates';
import type { MirrorAssessment } from '@/_types/professionalMirror';
import { ClipboardList } from 'lucide-react';

interface MirrorAssessmentCardProps {
  assessments: MirrorAssessment[];
}

/**
 * The educator's latest assessments, read only: this is the student's view of
 * the educator's record, so there is no control to add, edit or delete.
 */
export function MirrorAssessmentCard({
  assessments,
}: MirrorAssessmentCardProps) {
  return (
    <Card className="gap-3 border-line">
      <CardHeader className="grid-cols-[1fr_auto]">
        <CardTitle>Avaliação física</CardTitle>
        <ClipboardList className="size-5 text-icon-accent" aria-hidden="true" />
      </CardHeader>
      <CardContent>
        <ul aria-label="Últimas avaliações físicas" className="flex flex-col">
          {assessments.map(assessment => (
            <li
              key={assessment.id}
              className="flex flex-wrap items-baseline justify-between gap-x-3 border-b border-line py-2 text-sm last:border-b-0"
            >
              <time dateTime={assessment.assessedOn} className="font-medium">
                {formatIsoDay(assessment.assessedOn)}
              </time>
              <span>{formatMeasure(assessment.weightKg, 'kg')}</span>
              <span className="text-muted-foreground">
                Gordura corporal:{' '}
                {formatMeasure(assessment.bodyFatPercent, '%')}
              </span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
