import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/_components/ui/card';
import { FormRecordRow } from '@/_components/clinicalRecords/formRecordRow';
import type { MirrorAssessment } from '@/_types/professionalMirror';
import { ClipboardList } from 'lucide-react';

interface MirrorAssessmentCardProps {
  assessments: MirrorAssessment[];
  title?: string;
}

/**
 * A professional's recorded assessments, read only: this is the
 * student/patient's view of their own record, so there is no control to add,
 * edit or delete. Reads the generic clinical-records engine (PhysicalAssessment
 * is gone) — each entry carries its own frozen field values and derived BMI.
 */
export function MirrorAssessmentCard({
  assessments,
  title = 'Avaliação física',
}: MirrorAssessmentCardProps) {
  return (
    <Card className="gap-3 border-line">
      <CardHeader className="grid-cols-[1fr_auto]">
        <CardTitle>{title}</CardTitle>
        <ClipboardList className="size-5 text-icon-accent" aria-hidden="true" />
      </CardHeader>
      <CardContent>
        <ul aria-label="Avaliações" className="flex flex-col">
          {assessments.map(assessment => (
            <FormRecordRow key={assessment.id} record={assessment} />
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
