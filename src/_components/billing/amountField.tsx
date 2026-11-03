'use client';

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/_components/ui/form';
import { Input } from '@/_components/ui/input';
import { useFormContext } from 'react-hook-form';

interface AmountFieldProps {
  disabled: boolean;
}

export function AmountField({ disabled }: AmountFieldProps) {
  const { control } = useFormContext<{ amount: string }>();

  return (
    <FormField
      control={control}
      name="amount"
      render={({ field }) => (
        <FormItem>
          <FormLabel showMessage={false}>Valor (R$)</FormLabel>
          <FormControl>
            <Input
              {...field}
              inputMode="decimal"
              placeholder="180,00"
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
