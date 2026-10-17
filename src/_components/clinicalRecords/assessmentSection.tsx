'use client';

import { Button } from '@/_components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/_components/ui/dialog';
import type { FormRecord, Template } from '@/_types/clinicalRecords';
import { Plus } from 'lucide-react';
import { useState } from 'react';
import { FormFillingForm } from './formFillingForm';
import { FormRecordHistory } from './formRecordHistory';
import { TemplatesPanel } from './templatesPanel';

interface AssessmentSectionProps {
  clientId: string;
  templates: Template[];
  history: FormRecord[];
}

/**
 * Every avaliação is its own, independent record (US-009): a new one is
 * always a new fill, never a revision of the latest.
 */
export function AssessmentSection({
  clientId,
  templates,
  history,
}: AssessmentSectionProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Avaliação</h2>
        <div className="flex items-center gap-2">
          <TemplatesPanel purpose="ASSESSMENT" templates={templates} />
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
                onSaved={() => setOpen(false)}
              />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <FormRecordHistory
        records={history}
        emptyMessage="Nenhuma avaliação registrada ainda."
      />
    </div>
  );
}
