'use client';

import { Button, buttonVariants } from '@/_components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/_components/ui/dialog';
import type { FormRecord, Template } from '@/_types/clinicalRecords';
import type { ClinicalRecordsActions } from '@/_types/clinicalRecordsActions';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { FormFillingForm } from './formFillingForm';
import { FormRecordHistory } from './formRecordHistory';
import { TemplatesPanel } from './templatesPanel';

interface AssessmentSectionProps {
  clientId: string;
  templates: Template[];
  history: FormRecord[];
  actions: ClinicalRecordsActions;
}

interface NewAssessmentDialogProps {
  clientId: string;
  templates: Template[];
  actions: ClinicalRecordsActions;
}

function NewAssessmentDialog({
  clientId,
  templates,
  actions,
}: NewAssessmentDialogProps) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button type="button" size="sm">
          <Plus aria-hidden="true" />
          Nova avaliação
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[90dvh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Nova avaliação</DialogTitle>
        </DialogHeader>
        <FormFillingForm
          clientId={clientId}
          templates={templates}
          existing={null}
          actions={actions.formRecord}
          onSaved={() => setOpen(false)}
        />
      </DialogContent>
    </Dialog>
  );
}

/**
 * Every avaliação is its own, independent record (US-009): a new one is
 * always a new fill, never a revision of the latest. The Exportar PDF
 * action (US-005) targets the latest (`history[0]`) record and is absent
 * when there is none yet, never pointing at a request that would 404.
 */
export function AssessmentSection({
  clientId,
  templates,
  history,
  actions,
}: AssessmentSectionProps) {
  const latest = history[0] ?? null;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Avaliação</h2>
        <div className="flex items-center gap-2">
          <TemplatesPanel
            purpose="ASSESSMENT"
            templates={templates}
            actions={actions.template}
          />
          {latest && (
            <Link
              href={`/api/clinical-records/${actions.pdfRoleSegment}/clients/${clientId}/form-records/${latest.id}/pdf`}
              className={buttonVariants({ variant: 'outline' })}
            >
              Exportar PDF
            </Link>
          )}
          <NewAssessmentDialog
            clientId={clientId}
            templates={templates}
            actions={actions}
          />
        </div>
      </div>

      <FormRecordHistory
        records={history}
        emptyMessage="Nenhuma avaliação registrada ainda."
      />
    </div>
  );
}
