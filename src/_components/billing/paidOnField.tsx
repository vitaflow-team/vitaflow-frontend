'use client';

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/_components/ui/form';
import { Input } from '@/_components/ui/input';
import { todayInBrazil } from '@/_lib/studentsDates';
import { useFormContext } from 'react-hook-form';

interface PaidOnFieldProps {
  disabled: boolean;
}

export function PaidOnField({ disabled }: PaidOnFieldProps) {
  const { control } = useFormContext<{ paidOn: string }>();

  return (
    <FormField
      control={control}
      name="paidOn"
      render={({ field }) => (
        <FormItem>
          <FormLabel showMessage={false}>Data do pagamento</FormLabel>
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
