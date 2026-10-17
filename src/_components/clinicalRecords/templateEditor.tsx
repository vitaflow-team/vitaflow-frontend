'use client';

import { FormError } from '@/_components/students/formError';
import { Button } from '@/_components/ui/button';
import { Input } from '@/_components/ui/input';
import { Label } from '@/_components/ui/label';
import { useTemplateEditorSave } from '@/_hooks/useTemplateEditorSave';
import { blankField, draftsFromTemplate } from '@/_lib/templateFieldDrafts';
import type { Template, TemplatePurpose } from '@/_types/clinicalRecords';
import type { TemplateActions } from '@/_types/clinicalRecordsActions';
import type { TemplateFieldDraft } from '@/_types/templateFieldDraft';
import { useState } from 'react';
import { TemplateFieldRow } from './templateFieldRow';

interface TemplateFieldsEditorProps {
  purpose: TemplatePurpose;
  fields: TemplateFieldDraft[];
  disabled: boolean;
  onFieldsChange: (fields: TemplateFieldDraft[]) => void;
}

function TemplateFieldsEditor({
  purpose,
  fields,
  disabled,
  onFieldsChange,
}: TemplateFieldsEditorProps) {
  function updateField(key: string, next: TemplateFieldDraft) {
    onFieldsChange(fields.map(field => (field.key === key ? next : field)));
  }

  return (
    <div className="flex flex-col gap-3">
      {fields.map(field => (
        <TemplateFieldRow
          key={field.key}
          field={field}
          purpose={purpose}
          disabled={disabled}
          onChange={next => updateField(field.key, next)}
          onRemove={() =>
            onFieldsChange(fields.filter(f => f.key !== field.key))
          }
        />
      ))}
      <Button
        type="button"
        variant="outline"
        disabled={disabled}
        onClick={() => onFieldsChange([...fields, blankField()])}
        className="w-fit"
      >
        Adicionar campo
      </Button>
    </div>
  );
}

interface TemplateEditorProps {
  purpose: TemplatePurpose;
  existing?: Template;
  actions: TemplateActions;
  onSaved: () => void;
}

/**
 * Creates or edits a template: name, ordered fields with their type and
 * role toggles (US-003/US-004/US-006) — shared, unmodified, by every
 * professional type that owns templates (ADR-001).
 */
export function TemplateEditor({
  purpose,
  existing,
  actions,
  onSaved,
}: TemplateEditorProps) {
  const [name, setName] = useState(existing?.name ?? '');
  const [fields, setFields] = useState<TemplateFieldDraft[]>(() =>
    existing ? draftsFromTemplate(existing) : [blankField()]
  );
  const { save, isPending, error } = useTemplateEditorSave({
    purpose,
    existing,
    actions,
    onSaved,
  });

  return (
    <form
      className="flex flex-col gap-4"
      onSubmit={event => {
        event.preventDefault();
        save(name, fields);
      }}
      noValidate
    >
      <div className="flex flex-col gap-1">
        <Label htmlFor="template-name">Nome do modelo</Label>
        <Input
          id="template-name"
          value={name}
          maxLength={120}
          required
          disabled={isPending}
          onChange={event => setName(event.target.value)}
        />
      </div>

      <TemplateFieldsEditor
        purpose={purpose}
        fields={fields}
        disabled={isPending}
        onFieldsChange={setFields}
      />

      <FormError message={error} />
      <Button type="submit" disabled={isPending} className="w-fit">
        {isPending ? 'Salvando…' : 'Salvar modelo'}
      </Button>
    </form>
  );
}
