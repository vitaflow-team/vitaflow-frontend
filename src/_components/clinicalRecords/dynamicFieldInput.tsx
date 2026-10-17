'use client';

import { Checkbox } from '@/_components/ui/checkbox';
import { Input } from '@/_components/ui/input';
import { Label } from '@/_components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/_components/ui/radio-group';
import { Textarea } from '@/_components/ui/textarea';
import type { FieldAnswer } from '@/_lib/formRecordValues';
import type { TemplateField } from '@/_types/clinicalRecords';

interface ControlProps {
  id: string;
  field: TemplateField;
  value: FieldAnswer | undefined;
  onChange: (value: FieldAnswer | undefined) => void;
  disabled: boolean;
}

function LongTextControl({ id, value, onChange, disabled }: ControlProps) {
  return (
    <Textarea
      id={id}
      rows={4}
      value={typeof value === 'string' ? value : ''}
      onChange={event => onChange(event.target.value)}
      disabled={disabled}
    />
  );
}

function NumberControl({ id, value, onChange, disabled }: ControlProps) {
  return (
    <Input
      id={id}
      type="number"
      inputMode="decimal"
      value={typeof value === 'number' ? String(value) : ''}
      onChange={event => {
        const raw = event.target.value;
        onChange(raw === '' ? undefined : Number(raw));
      }}
      disabled={disabled}
    />
  );
}

function YesNoControl({
  id,
  value,
  onChange,
  disabled,
  label,
}: ControlProps & { label: string }) {
  return (
    <div className="flex items-center gap-2">
      <Checkbox
        id={id}
        checked={value === true}
        onCheckedChange={checked => onChange(checked === true)}
        disabled={disabled}
      />
      <Label htmlFor={id}>{label}</Label>
    </div>
  );
}

function MultipleChoiceControl({
  id,
  field,
  value,
  onChange,
  disabled,
}: ControlProps) {
  return (
    <RadioGroup
      value={typeof value === 'string' ? value : undefined}
      onValueChange={onChange}
      disabled={disabled}
    >
      {field.options.map(option => (
        <div key={option} className="flex items-center gap-2">
          <RadioGroupItem value={option} id={`${id}-${option}`} />
          <Label htmlFor={`${id}-${option}`}>{option}</Label>
        </div>
      ))}
    </RadioGroup>
  );
}

function TextControl({ id, value, onChange, disabled }: ControlProps) {
  return (
    <Input
      id={id}
      type="text"
      value={typeof value === 'string' ? value : ''}
      onChange={event => onChange(event.target.value)}
      disabled={disabled}
    />
  );
}

function fieldLabel(field: TemplateField): string {
  const roleHint = field.weightRole
    ? ' (peso)'
    : field.heightRole
      ? ' (altura)'
      : '';
  return `${field.label}${roleHint}${field.required ? '' : ' (opcional)'}`;
}

interface DynamicFieldInputProps {
  field: TemplateField;
  value: FieldAnswer | undefined;
  onChange: (value: FieldAnswer | undefined) => void;
  disabled: boolean;
}

/** Renders the right control for a template field's type, by role (ADR-002). */
export function DynamicFieldInput({
  field,
  value,
  onChange,
  disabled,
}: DynamicFieldInputProps) {
  const label = fieldLabel(field);
  const id = `field-${field.id}`;
  const props = { id, field, value, onChange, disabled };

  return (
    <div className="flex flex-col gap-1">
      {field.fieldType !== 'YES_NO' && <Label htmlFor={id}>{label}</Label>}
      {field.fieldType === 'LONG_TEXT' && <LongTextControl {...props} />}
      {field.fieldType === 'NUMBER' && <NumberControl {...props} />}
      {field.fieldType === 'YES_NO' && (
        <YesNoControl {...props} label={label} />
      )}
      {field.fieldType === 'MULTIPLE_CHOICE' && (
        <MultipleChoiceControl {...props} />
      )}
      {field.fieldType === 'SHORT_TEXT' && <TextControl {...props} />}
    </div>
  );
}
