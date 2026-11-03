'use client';

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/_components/ui/form';
import { Input } from '@/_components/ui/input';
import { BILLING_LIMITS } from '@/_constants/billingLimits';
import { todayInBrazil } from '@/_lib/studentsDates';
import { useFormContext } from 'react-hook-form';

function maxDueDate(): string {
  const [y, m, d] = todayInBrazil().split('-').map(Number);
  const date = new Date(
    Date.UTC(y, m - 1, d + BILLING_LIMITS.dueDateMaxDaysAhead)
  );
  return date.toISOString().slice(0, 10);
}

interface DueDateFieldProps {
  disabled: boolean;
}

export function DueDateField({ disabled }: DueDateFieldProps) {
  const { control } = useFormContext<{ dueDate: string }>();

  return (
    <FormField
      control={control}
      name="dueDate"
      render={({ field }) => (
        <FormItem>
          <FormLabel showMessage={false}>Vencimento</FormLabel>
          <FormControl>
            <Input
              {...field}
              type="date"
              min={todayInBrazil()}
              max={maxDueDate()}
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
