'use client';

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/_components/ui/form';
import { Input } from '@/_components/ui/input';
import type { ConnectAccountFormValues } from '@/_schema/billing';
import { useFormContext } from 'react-hook-form';

interface ApiKeyFieldProps {
  disabled: boolean;
}

export function ApiKeyField({ disabled }: ApiKeyFieldProps) {
  const { control } = useFormContext<ConnectAccountFormValues>();

  return (
    <FormField
      control={control}
      name="apiKey"
      render={({ field }) => (
        <FormItem>
          <FormLabel showMessage={false}>Chave de API do Asaas</FormLabel>
          <FormControl>
            <Input
              {...field}
              type="password"
              autoComplete="off"
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
