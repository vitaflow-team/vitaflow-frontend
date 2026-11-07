'use client';

import { Button, buttonVariants } from '@/_components/ui/button';
import { formatFieldValue, formatRecordedAt } from '@/_lib/formRecordDisplay';
import type { FormRecord, Template } from '@/_types/clinicalRecords';
import type { ClinicalRecordsActions } from '@/_types/clinicalRecordsActions';
import Link from 'next/link';
import { useState } from 'react';
import { FormFillingForm } from './formFillingForm';
import { TemplatesPanel } from './templatesPanel';

interface AnamneseSectionProps {
  clientId: string;
  templates: Template[];
  latest: FormRecord | null;
  actions: ClinicalRecordsActions;
}

interface FilledAnamneseProps {
  clientId: string;
  latest: FormRecord;
  pdfRoleSegment: ClinicalRecordsActions['pdfRoleSegment'];
  onEdit: () => void;
}

/** The read-only answers plus the edit and PDF-export (US-005) actions. */
function FilledAnamnese({
  clientId,
  latest,
  pdfRoleSegment,
  onEdit,
}: FilledAnamneseProps) {
  return (
    <div className="flex flex-col gap-3">
      <p className="text-sm text-muted-foreground">
        Preenchida em {formatRecordedAt(latest.recordedAt)}.
      </p>
      <dl className="grid grid-cols-2 gap-2 text-sm sm:grid-cols-3">
        {latest.values.map(value => (
          <div key={value.fieldLabel}>
            <dt className="text-muted-foreground">{value.fieldLabel}</dt>
            <dd>{formatFieldValue(value.value)}</dd>
          </div>
        ))}
      </dl>
      <div className="flex items-center gap-2">
        <Button
          type="button"
          variant="outline"
          onClick={onEdit}
          className="w-fit"
        >
          Editar anamnese
        </Button>
        <Link
          href={`/api/clinical-records/${pdfRoleSegment}/clients/${clientId}/form-records/${latest.id}/pdf`}
          className={buttonVariants({ variant: 'outline' })}
        >
          Exportar PDF
        </Link>
      </div>
    </div>
  );
}

/**
 * Anamnese is filled once and revised in place (US-007/US-008): with none
 * yet, the fill form shows directly; once filled, the answers show
 * read-only with an edit action, never a second record.
 */
export function AnamneseSection({
  clientId,
  templates,
  latest,
  actions,
}: AnamneseSectionProps) {
  const [editing, setEditing] = useState(false);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Anamnese</h2>
        <TemplatesPanel
          purpose="ANAMNESE"
          templates={templates}
          actions={actions.template}
        />
      </div>

      {!latest || editing ? (
        <FormFillingForm
          clientId={clientId}
          templates={templates}
          existing={editing ? latest : null}
          actions={actions.formRecord}
          onSaved={() => setEditing(false)}
        />
      ) : (
        <FilledAnamnese
          clientId={clientId}
          latest={latest}
          pdfRoleSegment={actions.pdfRoleSegment}
          onEdit={() => setEditing(true)}
        />
      )}
    </div>
  );
}
