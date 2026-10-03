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
import { todayInBrazil } from '@/_lib/studentsDates';
import type { StudentFormValues } from '@/_schema/students';
import { useFormContext } from 'react-hook-form';

interface StudentFieldProps {
  disabled: boolean;
  readOnly?: boolean;
}

export function StudentNameField({ disabled }: StudentFieldProps) {
  const { control } = useFormContext<StudentFormValues>();

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
              maxLength={120}
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

export function StudentPhoneField({ disabled }: StudentFieldProps) {
  const { control } = useFormContext<StudentFormValues>();

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

export function StudentBirthDateField({ disabled }: StudentFieldProps) {
  const { control } = useFormContext<StudentFormValues>();

  return (
    <FormField
      control={control}
      name="birthDate"
      render={({ field }) => (
        <FormItem>
          <FormLabel showMessage={false}>
            Data de nascimento (opcional)
          </FormLabel>
          <FormControl>
            <Input
              {...field}
              type="date"
              max={todayInBrazil()}
              disabled={disabled}
            />
          </FormControl>
          <FormMessage role="alert" />
        </FormItem>
      )}
    />
  );
}

export function StudentEmailField({ disabled, readOnly }: StudentFieldProps) {
  const { control } = useFormContext<StudentFormValues>();

  return (
    <FormField
      control={control}
      name="email"
      render={({ field }) => (
        <FormItem>
          <FormLabel showMessage={false}>E-mail</FormLabel>
          <FormControl>
            <Input
              {...field}
              type="email"
              inputMode="email"
              autoComplete="off"
              readOnly={readOnly}
              aria-readonly={readOnly}
              disabled={disabled}
            />
          </FormControl>
          <FormMessage role="alert" />
        </FormItem>
      )}
    />
  );
}
