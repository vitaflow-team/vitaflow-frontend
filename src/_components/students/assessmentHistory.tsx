import type { Assessment } from '@/_types/students';
import { AssessmentRow } from './assessmentRow';

interface AssessmentHistoryProps {
  assessments: Assessment[];
  /** The newest saved assessment, whose height starts an edit's reference. */
  latest: Assessment | null;
  declarationAccepted: boolean;
}

/** Newest first; assessments of the same date are all listed. */
export function AssessmentHistory({
  assessments,
  latest,
  declarationAccepted,
}: AssessmentHistoryProps) {
  if (assessments.length === 0) {
    return (
      <p className="py-6 text-sm text-muted-foreground">
        Nenhuma avaliação registrada ainda. Use “Nova avaliação” para começar.
      </p>
    );
  }

  return (
    <ul aria-label="Histórico de avaliações" className="flex flex-col">
      {assessments.map(assessment => (
        <AssessmentRow
          key={assessment.id}
          assessment={assessment}
          previous={latest}
          declarationAccepted={declarationAccepted}
        />
      ))}
    </ul>
  );
}
