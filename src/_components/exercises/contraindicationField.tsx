'use client';

import { Checkbox } from '@/_components/ui/checkbox';
import { FormField } from '@/_components/ui/form';
import { Label } from '@/_components/ui/label';
import { CONTRAINDICATION_LABELS } from '@/_constants/exerciseCatalog';
import type { ExerciseFormMethods } from '@/_types/exerciseFormMethods';

const OPTIONS = Object.entries(CONTRAINDICATION_LABELS);

interface ContraindicationFieldProps {
  methods: ExerciseFormMethods;
  disabled?: boolean;
}

function toggle(selected: string[], value: string, checked: boolean) {
  return checked
    ? [...selected, value]
    : selected.filter(item => item !== value);
}

/** Optional restrictions; none checked is valid (US-006.AC-3, US-010.AC-1). */
export function ContraindicationField({
  methods,
  disabled,
}: ContraindicationFieldProps) {
  return (
    <FormField
      control={methods.control}
      name="contraindications"
      render={({ field }) => (
        <fieldset className="mb-2 flex flex-col gap-2">
          <legend className="mb-1 text-sm font-medium">
            Contraindicações (opcional)
          </legend>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {OPTIONS.map(([value, label]) => (
              <div key={value} className="flex items-center gap-2">
                <Checkbox
                  id={`contraindication-${value}`}
                  checked={field.value.includes(value)}
                  disabled={disabled}
                  onCheckedChange={checked =>
                    field.onChange(toggle(field.value, value, checked === true))
                  }
                />
                <Label htmlFor={`contraindication-${value}`}>{label}</Label>
              </div>
            ))}
          </div>
        </fieldset>
      )}
    />
  );
}
