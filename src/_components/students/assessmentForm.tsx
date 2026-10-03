'use client';

import { Button } from '@/_components/ui/button';
import { Form } from '@/_components/ui/form';
import {
  ASSESSMENT_CIRCUMFERENCE_FIELDS,
  ASSESSMENT_COMPOSITION_FIELDS,
  ASSESSMENT_REQUIRED_FIELDS,
} from '@/_constants/assessmentFields';
import { useAssessmentForm } from '@/_hooks/useAssessmentForm';
import type { Assessment } from '@/_types/students';
import { useEffect } from 'react';
import { DeclarationDialog } from './declarationDialog';
import {
  AssessmentDateField,
  AssessmentFieldGroup,
} from './assessmentFormFields';
import { FormError } from './formError';

interface AssessmentFormProps {
  studentId: string;
  existing?: Assessment;
  previous?: Assessment | null;
  declarationAccepted: boolean;
  onSaved: () => void;
  /** Reports whether typed values would be lost, for the close confirmation. */
  onDirtyChange: (dirty: boolean) => void;
}

export function AssessmentForm({
  studentId,
  existing,
  previous,
  declarationAccepted,
  onSaved,
  onDirtyChange,
}: AssessmentFormProps) {
  const form = useAssessmentForm({
    studentId,
    existing,
    previous,
    declarationAccepted,
    onSaved,
  });
  const { isDirty } = form;
  useEffect(() => onDirtyChange(isDirty), [isDirty, onDirtyChange]);

  return (
    <Form {...form.methods}>
      <form className="flex flex-col gap-4" onSubmit={form.onSubmit} noValidate>
        <AssessmentDateField disabled={form.isPending} />
        <AssessmentFieldGroup
          title="Medidas principais"
          fields={ASSESSMENT_REQUIRED_FIELDS}
          disabled={form.isPending}
        />
        <AssessmentFieldGroup
          title="Composição e condicionamento (opcional)"
          fields={ASSESSMENT_COMPOSITION_FIELDS}
          disabled={form.isPending}
        />
        <AssessmentFieldGroup
          title="Circunferências (opcional)"
          fields={ASSESSMENT_CIRCUMFERENCE_FIELDS}
          disabled={form.isPending}
        />
        <FormError message={form.error} />
        <Button type="submit" disabled={form.isPending}>
          {form.isPending ? 'Salvando…' : 'Salvar avaliação'}
        </Button>
      </form>
      <DeclarationDialog
        open={form.declarationOpen}
        onAccept={form.acceptDeclaration}
        onDecline={form.declineDeclaration}
      />
    </Form>
  );
}
