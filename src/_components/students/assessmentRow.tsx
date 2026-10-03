import { Button } from '@/_components/ui/button';
import { formatMeasure } from '@/_lib/assessmentDisplay';
import { formatIsoDay } from '@/_lib/studentsDates';
import type { Assessment } from '@/_types/students';
import { Pencil } from 'lucide-react';
import { AssessmentFormDialog } from './assessmentFormDialog';
import { DeleteAssessmentButton } from './deleteAssessmentButton';

interface AssessmentRowProps {
  assessment: Assessment;
  previous: Assessment | null;
  declarationAccepted: boolean;
}

/** One assessment: the date, the two headline values, and edit and delete. */
export function AssessmentRow({
  assessment,
  previous,
  declarationAccepted,
}: AssessmentRowProps) {
  const date = formatIsoDay(assessment.assessedOn);

  return (
    <li className="flex items-center justify-between gap-3 border-b border-line py-3 last:border-b-0">
      <div className="grid min-w-0 flex-1 gap-1 sm:grid-cols-3 sm:items-center">
        <time dateTime={assessment.assessedOn} className="text-sm">
          {date}
        </time>
        <p className="font-semibold">
          {formatMeasure(assessment.weightKg, 'kg')}
        </p>
        <p className="text-sm text-muted-foreground">
          Gordura corporal: {formatMeasure(assessment.bodyFatPercent, '%')}
        </p>
      </div>
      <div className="flex shrink-0 gap-2">
        <AssessmentFormDialog
          studentId={assessment.studentId}
          existing={assessment}
          previous={previous}
          declarationAccepted={declarationAccepted}
          title={`Editar avaliação de ${date}`}
          trigger={
            <Button
              variant="outline"
              size="icon"
              className="size-11 md:size-9"
              aria-label={`Editar avaliação de ${date}`}
            >
              <Pencil aria-hidden="true" />
            </Button>
          }
        />
        <DeleteAssessmentButton
          studentId={assessment.studentId}
          assessmentId={assessment.id}
          assessedOn={assessment.assessedOn}
        />
      </div>
    </li>
  );
}
