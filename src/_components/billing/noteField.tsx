'use client';

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/_components/ui/form';
import { Textarea } from '@/_components/ui/textarea';
import { BILLING_LIMITS } from '@/_constants/billingLimits';
import { useFormContext } from 'react-hook-form';

interface NoteFieldProps {
  disabled: boolean;
}

export function NoteField({ disabled }: NoteFieldProps) {
  const { control } = useFormContext<{ note?: string }>();

  return (
    <FormField
      control={control}
      name="note"
      render={({ field }) => (
        <FormItem>
          <FormLabel showMessage={false}>Observação (opcional)</FormLabel>
          <FormControl>
            <Textarea
              {...field}
              disabled={disabled}
              maxLength={BILLING_LIMITS.manualNoteMaxLength}
            />
          </FormControl>
          <FormMessage role="alert" />
        </FormItem>
      )}
    />
  );
}
