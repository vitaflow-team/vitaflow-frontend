import { Button } from '@/_components/ui/button';
import type { AssessmentList, Assessment } from '@/_types/students';
import { Plus } from 'lucide-react';
import { AssessmentFormDialog } from './assessmentFormDialog';
import { AssessmentHistory } from './assessmentHistory';
import { AssessmentPagination } from './assessmentPagination';
import { VariationLine } from './variationLine';

interface AssessmentTabProps {
  studentId: string;
  list: AssessmentList;
  latest: Assessment | null;
  declarationAccepted: boolean;
  openNewForm: boolean;
}

/** The "Avaliação física" tab: the new-assessment action, the variation and the history. */
export function AssessmentTab({
  studentId,
  list,
  latest,
  declarationAccepted,
  openNewForm,
}: AssessmentTabProps) {
  return (
    <section aria-labelledby="assessment-title" className="flex flex-col gap-3">
      <div className="flex items-center justify-between gap-2">
        <h2 id="assessment-title" className="text-lg font-semibold">
          Avaliação física
        </h2>
        <AssessmentFormDialog
          studentId={studentId}
          previous={latest}
          declarationAccepted={declarationAccepted}
          defaultOpen={openNewForm}
          title="Nova avaliação"
          trigger={
            <Button>
              <Plus aria-hidden="true" />
              Nova avaliação
            </Button>
          }
        />
      </div>
      <VariationLine variation={list.variation} />
      <AssessmentHistory
        assessments={list.items}
        latest={latest}
        declarationAccepted={declarationAccepted}
      />
      <AssessmentPagination
        studentId={studentId}
        page={list.page}
        total={list.total}
        pageSize={list.pageSize}
      />
    </section>
  );
}
