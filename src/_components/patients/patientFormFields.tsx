'use client';

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/_components/ui/form';
import { Input } from '@/_components/ui/input';
import { formatPhone } from '@/_lib/stringUtils';
import type { PatientFormValues } from '@/_schema/patients';
import { useFormContext } from 'react-hook-form';

interface PatientFieldProps {
  disabled: boolean;
}

export function PatientNameField({ disabled }: PatientFieldProps) {
  const { control } = useFormContext<PatientFormValues>();

  return (
    <FormField
      control={control}
      name="name"
      render={({ field }) => (
        <FormItem>
          <FormLabel showMessage={false}>Nome</FormLabel>
          <FormControl>
            <Input
              {...field}
              autoComplete="off"
              maxLength={255}
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

export function PatientEmailField({ disabled }: PatientFieldProps) {
  const { control } = useFormContext<PatientFormValues>();

  return (
    <FormField
      control={control}
      name="email"
      render={({ field }) => (
        <FormItem>
          <FormLabel showMessage={false}>E-mail (opcional)</FormLabel>
          <FormControl>
            <Input
              {...field}
              type="email"
              inputMode="email"
              autoComplete="off"
              disabled={disabled}
            />
          </FormControl>
          <FormMessage role="alert" />
        </FormItem>
      )}
    />
  );
}

export function PatientPhoneField({ disabled }: PatientFieldProps) {
  const { control } = useFormContext<PatientFormValues>();

  return (
    <FormField
      control={control}
      name="phone"
      render={({ field }) => (
        <FormItem>
          <FormLabel showMessage={false}>Telefone (opcional)</FormLabel>
          <FormControl>
            <Input
              {...field}
              type="tel"
              inputMode="tel"
              autoComplete="off"
              disabled={disabled}
              onBlur={event => field.onChange(formatPhone(event.target.value))}
            />
          </FormControl>
          <FormMessage role="alert" />
        </FormItem>
      )}
    />
  );
}
