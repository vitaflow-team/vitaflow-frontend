'use client';

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/_components/ui/form';
import { Input } from '@/_components/ui/input';
import { formatTaxId } from '@/_lib/taxId';
import { useFormContext } from 'react-hook-form';

interface TaxIdFieldProps {
  disabled: boolean;
  label?: string;
}

export function TaxIdField({ disabled, label }: TaxIdFieldProps) {
  const { control } = useFormContext<{ cpfCnpj: string }>();

  return (
    <FormField
      control={control}
      name="cpfCnpj"
      render={({ field }) => (
        <FormItem>
          <FormLabel showMessage={false}>
            {label ?? 'CPF ou CNPJ do aluno'}
          </FormLabel>
          <FormControl>
            <Input
              {...field}
              onChange={event =>
                field.onChange(formatTaxId(event.target.value))
              }
              inputMode="numeric"
              placeholder="000.000.000-00"
              disabled={disabled}
              required
              aria-required="true"
            />
          </FormControl>
          <FormMessage role="alert" />
        </FormItem>
      )}
    />
  );
}
