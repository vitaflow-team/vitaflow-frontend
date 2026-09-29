'use client';

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from '@/_components/ui/form';
import { Input, type InputProps } from '@/_components/ui/input';
import type { profileFormData } from '@/_schema/profile';
import type { FieldPath } from 'react-hook-form';
import { useFormContext } from 'react-hook-form';

interface ProfileTextFieldProps {
  name: Exclude<FieldPath<profileFormData>, 'avatar' | 'address'>;
  label: string;
  id: string;
  disabled: boolean;
  type?: InputProps['type'];
  max?: InputProps['max'];
  icon?: InputProps['icon'];
  /** Mask applied to the typed value when the field loses focus. */
  formatOnBlur?: (value: string) => string;
}

/** One labelled text input of the profile form. */
export function ProfileTextField({
  name,
  label,
  id,
  disabled,
  type,
  max,
  icon,
  formatOnBlur,
}: ProfileTextFieldProps) {
  const { control } = useFormContext<profileFormData>();

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Input
              id={id}
              {...field}
              type={type}
              max={max}
              icon={icon}
              disabled={disabled}
              onBlur={
                formatOnBlur
                  ? event => field.onChange(formatOnBlur(event.target.value))
                  : field.onBlur
              }
            />
          </FormControl>
        </FormItem>
      )}
    />
  );
}
