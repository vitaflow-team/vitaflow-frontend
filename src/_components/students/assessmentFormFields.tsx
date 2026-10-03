'use client';

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/_components/ui/form';
import { Input } from '@/_components/ui/input';
import type { AssessmentFieldDef } from '@/_constants/assessmentFields';
import { todayInBrazil } from '@/_lib/studentsDates';
import type { AssessmentFormInput } from '@/_schema/assessment';
import { useFormContext } from 'react-hook-form';

/** Decimal keypad by default, whole-number keypad for heart rate, text where a minus is needed. */
export function inputModeFor(
  def: AssessmentFieldDef
): 'decimal' | 'numeric' | 'text' {
  if (def.min < 0) return 'text';

  return def.integer ? 'numeric' : 'decimal';
}

export function AssessmentDateField({ disabled }: { disabled: boolean }) {
  const { control } = useFormContext<AssessmentFormInput>();

  return (
    <FormField
      control={control}
      name="assessedOn"
      render={({ field }) => (
        <FormItem>
          <FormLabel showMessage={false}>Data da avaliação</FormLabel>
          <FormControl>
            <Input
              {...field}
              type="date"
              max={todayInBrazil()}
              required
              aria-required="true"
              disabled={disabled}
            />
          </FormControl>
          <FormMessage role="alert" />
        </FormItem>
      )}
    />
  );
}

interface AssessmentNumberFieldProps {
  def: AssessmentFieldDef;
  disabled: boolean;
}

export function AssessmentNumberField({
  def,
  disabled,
}: AssessmentNumberFieldProps) {
  const { control } = useFormContext<AssessmentFormInput>();

  return (
    <FormField
      control={control}
      name={def.name}
      render={({ field }) => (
        <FormItem className="min-w-0">
          <FormLabel showMessage={false}>
            {def.label} ({def.unit})
          </FormLabel>
          <FormControl>
            <Input
              {...field}
              type="text"
              inputMode={inputModeFor(def)}
              autoComplete="off"
              required={def.required}
              aria-required={def.required ? 'true' : undefined}
              disabled={disabled}
            />
          </FormControl>
          <FormMessage role="alert" />
        </FormItem>
      )}
    />
  );
}

interface AssessmentFieldGroupProps {
  title: string;
  fields: AssessmentFieldDef[];
  disabled: boolean;
}

/** A titled group of number fields: two columns on a phone, three from `sm`. */
export function AssessmentFieldGroup({
  title,
  fields,
  disabled,
}: AssessmentFieldGroupProps) {
  return (
    <fieldset className="flex flex-col gap-1">
      <legend className="pb-1 text-sm font-semibold">{title}</legend>
      <div className="grid grid-cols-2 gap-x-3 sm:grid-cols-3">
        {fields.map(def => (
          <AssessmentNumberField key={def.name} def={def} disabled={disabled} />
        ))}
      </div>
    </fieldset>
  );
}
