'use client';

import { DeclarationDialog } from '@/_components/students/declarationDialog';
import { FormError } from '@/_components/students/formError';
import { Button } from '@/_components/ui/button';
import { useFormFillingSave } from '@/_hooks/useFormFillingSave';
import { prefillAnswers, type AnswersByFieldId } from '@/_lib/formRecordValues';
import type {
  FormRecord,
  Template,
  TemplateField,
} from '@/_types/clinicalRecords';
import type { FormRecordActions } from '@/_types/clinicalRecordsActions';
import { useState } from 'react';
import { DynamicFieldInput } from './dynamicFieldInput';
import { TemplatePicker } from './templatePicker';

interface FormFillingFieldsProps {
  fields: TemplateField[];
  answers: AnswersByFieldId;
  onAnswerChange: (fieldId: string, value: AnswersByFieldId[string]) => void;
  disabled: boolean;
}

function FormFillingFields({
  fields,
  answers,
  onAnswerChange,
  disabled,
}: FormFillingFieldsProps) {
  return (
    <>
      {fields.map(field => (
        <DynamicFieldInput
          key={field.id}
          field={field}
          value={answers[field.id]}
          onChange={value => onAnswerChange(field.id, value)}
          disabled={disabled}
        />
      ))}
    </>
  );
}

interface FormFillingFormProps {
  clientId: string;
  templates: Template[];
  existing: FormRecord | null;
  actions: FormRecordActions;
  onSaved: () => void;
}

/**
 * Fills a new record, or revises an existing one against the current
 * template (US-007/US-008/US-009) — shared by anamnese (single, revised in
 * place) and avaliação (one new record per call) alike.
 */
export function FormFillingForm({
  clientId,
  templates,
  existing,
  actions,
  onSaved,
}: FormFillingFormProps) {
  const active = templates.filter(template => template.active);
  const [templateId, setTemplateId] = useState(active[0]?.id ?? '');
  const template = active.find(item => item.id === templateId) ?? active[0];
  const [answers, setAnswers] = useState<AnswersByFieldId>(() =>
    prefillAnswers(template?.fields ?? [], existing)
  );

  const {
    save,
    isPending,
    error,
    awaitingDeclaration,
    acceptDeclaration,
    declineDeclaration,
  } = useFormFillingSave({
    clientId,
    template,
    existing,
    answers,
    actions,
    onSaved,
  });

  if (!template) {
    return (
      <p className="text-sm text-muted-foreground">
        Crie um modelo antes de preencher um registro.
      </p>
    );
  }

  function changeTemplate(nextId: string) {
    setTemplateId(nextId);
    const next = active.find(item => item.id === nextId);
    setAnswers(prefillAnswers(next?.fields ?? [], existing));
  }

  return (
    <form
      className="flex flex-col gap-4"
      onSubmit={event => {
        event.preventDefault();
        save();
      }}
      noValidate
    >
      <TemplatePicker
        templates={active}
        value={template.id}
        onChange={changeTemplate}
        disabled={isPending}
      />
      <FormFillingFields
        fields={template.fields}
        answers={answers}
        onAnswerChange={(fieldId, value) =>
          setAnswers(current => ({ ...current, [fieldId]: value }))
        }
        disabled={isPending}
      />
      <FormError message={error} />
      <Button type="submit" disabled={isPending}>
        {isPending ? 'Salvando…' : 'Salvar'}
      </Button>
      <DeclarationDialog
        open={awaitingDeclaration}
        onAccept={acceptDeclaration}
        onDecline={declineDeclaration}
      />
    </form>
  );
}
