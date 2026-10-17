'use client';

import { Button } from '@/_components/ui/button';
import { Checkbox } from '@/_components/ui/checkbox';
import { Input } from '@/_components/ui/input';
import { Label } from '@/_components/ui/label';
import { FIELD_TYPES } from '@/_schema/clinicalRecords';
import type { TemplatePurpose } from '@/_types/clinicalRecords';
import type { TemplateFieldDraft } from '@/_types/templateFieldDraft';
import { X } from 'lucide-react';

const FIELD_TYPE_LABELS: Record<(typeof FIELD_TYPES)[number], string> = {
  SHORT_TEXT: 'Texto curto',
  LONG_TEXT: 'Texto longo',
  NUMBER: 'Número',
  YES_NO: 'Sim/Não',
  MULTIPLE_CHOICE: 'Múltipla escolha',
};

const SELECT_CLASS =
  'h-10 w-full rounded-md border border-input bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50';

interface RowProps {
  field: TemplateFieldDraft;
  disabled: boolean;
  onChange: (next: TemplateFieldDraft) => void;
}

function FieldOptionsInput({ field, disabled, onChange }: RowProps) {
  if (field.fieldType !== 'MULTIPLE_CHOICE') return null;

  return (
    <div>
      <Label htmlFor={`field-options-${field.key}`}>
        Opções (uma por linha)
      </Label>
      <textarea
        id={`field-options-${field.key}`}
        className="min-h-20 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        value={field.options.join('\n')}
        disabled={disabled}
        onChange={event =>
          onChange({
            ...field,
            options: event.target.value
              .split('\n')
              .map(option => option.trim())
              .filter(Boolean),
          })
        }
      />
    </div>
  );
}

function FieldRoleToggles({
  field,
  purpose,
  disabled,
  onChange,
}: RowProps & { purpose: TemplatePurpose }) {
  return (
    <div className="flex flex-wrap items-center gap-4 text-sm">
      <label className="flex items-center gap-2">
        <Checkbox
          checked={field.required}
          disabled={disabled}
          onCheckedChange={checked =>
            onChange({ ...field, required: checked === true })
          }
        />
        Obrigatório
      </label>
      {purpose === 'ASSESSMENT' && field.fieldType === 'NUMBER' && (
        <>
          <label className="flex items-center gap-2">
            <Checkbox
              checked={field.weightRole}
              disabled={disabled}
              onCheckedChange={checked =>
                onChange({ ...field, weightRole: checked === true })
              }
            />
            Peso (para o IMC)
          </label>
          <label className="flex items-center gap-2">
            <Checkbox
              checked={field.heightRole}
              disabled={disabled}
              onCheckedChange={checked =>
                onChange({ ...field, heightRole: checked === true })
              }
            />
            Altura (para o IMC)
          </label>
        </>
      )}
    </div>
  );
}

function FieldLabelAndType({
  field,
  disabled,
  onChange,
  onRemove,
}: RowProps & { onRemove: () => void }) {
  const id = `field-draft-${field.key}`;

  return (
    <div className="flex items-start gap-2">
      <div className="flex-1">
        <Label htmlFor={`${id}-label`}>Rótulo do campo</Label>
        <Input
          id={`${id}-label`}
          value={field.label}
          maxLength={120}
          disabled={disabled}
          onChange={event => onChange({ ...field, label: event.target.value })}
        />
      </div>
      <div className="w-44">
        <Label htmlFor={`${id}-type`}>Tipo</Label>
        <select
          id={`${id}-type`}
          className={SELECT_CLASS}
          value={field.fieldType}
          disabled={disabled}
          onChange={event =>
            onChange({
              ...field,
              fieldType: event.target.value as TemplateFieldDraft['fieldType'],
            })
          }
        >
          {FIELD_TYPES.map(type => (
            <option key={type} value={type}>
              {FIELD_TYPE_LABELS[type]}
            </option>
          ))}
        </select>
      </div>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        aria-label="Remover campo"
        disabled={disabled}
        onClick={onRemove}
        className="mt-6"
      >
        <X aria-hidden="true" />
      </Button>
    </div>
  );
}

interface TemplateFieldRowProps {
  field: TemplateFieldDraft;
  purpose: TemplatePurpose;
  disabled: boolean;
  onChange: (next: TemplateFieldDraft) => void;
  onRemove: () => void;
}

export function TemplateFieldRow({
  field,
  purpose,
  disabled,
  onChange,
  onRemove,
}: TemplateFieldRowProps) {
  return (
    <div className="flex flex-col gap-2 rounded-md border border-line p-3">
      <FieldLabelAndType
        field={field}
        disabled={disabled}
        onChange={onChange}
        onRemove={onRemove}
      />
      <FieldOptionsInput
        field={field}
        disabled={disabled}
        onChange={onChange}
      />
      <FieldRoleToggles
        field={field}
        purpose={purpose}
        disabled={disabled}
        onChange={onChange}
      />
    </div>
  );
}
