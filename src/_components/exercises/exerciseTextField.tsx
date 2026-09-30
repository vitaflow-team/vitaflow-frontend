'use client';

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from '@/_components/ui/form';
import { Input } from '@/_components/ui/input';
import { Textarea } from '@/_components/ui/textarea';
import type { ExerciseFormMethods } from '@/_types/exerciseFormMethods';

type TextFieldName =
  | 'name'
  | 'description'
  | 'difficulty'
  | 'imageUrl'
  | 'videoUrl';

interface ExerciseTextFieldProps {
  methods: ExerciseFormMethods;
  name: TextFieldName;
  label: string;
  placeholder?: string;
  required?: boolean;
  multiline?: boolean;
  disabled?: boolean;
}

export function ExerciseTextField({
  methods,
  name,
  label,
  placeholder,
  required,
  multiline,
  disabled,
}: ExerciseTextFieldProps) {
  return (
    <FormField
      control={methods.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{required ? `${label} *` : label}</FormLabel>
          <FormControl>
            {multiline ? (
              <Textarea
                {...field}
                placeholder={placeholder}
                disabled={disabled}
                className="min-h-32"
              />
            ) : (
              <Input {...field} placeholder={placeholder} disabled={disabled} />
            )}
          </FormControl>
        </FormItem>
      )}
    />
  );
}
