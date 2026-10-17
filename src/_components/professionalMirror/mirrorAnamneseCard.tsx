import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/_components/ui/card';
import { FormRecordRow } from '@/_components/clinicalRecords/formRecordRow';
import type { MirrorAssessment } from '@/_types/professionalMirror';
import { NotebookText } from 'lucide-react';

interface MirrorAnamneseCardProps {
  anamnese: MirrorAssessment;
}

/** The patient's own anamnese answers, read only (US-018). */
export function MirrorAnamneseCard({ anamnese }: MirrorAnamneseCardProps) {
  return (
    <Card className="gap-3 border-line">
      <CardHeader className="grid-cols-[1fr_auto]">
        <CardTitle>Anamnese</CardTitle>
        <NotebookText className="size-5 text-icon-accent" aria-hidden="true" />
      </CardHeader>
      <CardContent>
        <ul aria-label="Anamnese" className="flex flex-col">
          <FormRecordRow record={anamnese} />
        </ul>
      </CardContent>
    </Card>
  );
}
