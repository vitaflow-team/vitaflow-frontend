'use client';

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from '@/_components/ui/form';
import type { ExerciseFormMethods } from '@/_types/exerciseFormMethods';

interface SelectOption {
  value: string;
  label: string;
}

interface ExerciseSelectFieldProps {
  methods: ExerciseFormMethods;
  name: 'muscleGroup' | 'equipment';
  label: string;
  placeholder: string;
  options: SelectOption[];
  disabled?: boolean;
}

/** A required choice; the empty option only prompts and never validates. */
export function ExerciseSelectField({
  methods,
  name,
  label,
  placeholder,
  options,
  disabled,
}: ExerciseSelectFieldProps) {
  return (
    <FormField
      control={methods.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{`${label} *`}</FormLabel>
          <FormControl>
            <select
              {...field}
              disabled={disabled}
              className="border-input bg-background focus-visible:ring-ring h-10 w-full rounded-md border px-3 text-base focus-visible:ring-2 focus-visible:outline-none disabled:opacity-60 md:text-sm"
            >
              <option value="">{placeholder}</option>
              {options.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </FormControl>
        </FormItem>
      )}
    />
  );
}
