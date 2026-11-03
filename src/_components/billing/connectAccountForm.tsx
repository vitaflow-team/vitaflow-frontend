'use client';

import { connectAccount } from '@/_actions/billing/connectAccount';
import { FormError } from '@/_components/students/formError';
import { Button } from '@/_components/ui/button';
import { Form } from '@/_components/ui/form';
import {
  type ConnectAccountFormValues,
  connectAccountSchema,
} from '@/_schema/billing';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useServerAction } from 'zsa-react';
import { ApiKeyField } from './apiKeyField';

interface ConnectAccountFormProps {
  submitLabel: string;
  onConnected?: () => void;
}

/** The field keeps its value on failure (US-001.EC-2/EC-3) — nothing resets it. */
export function ConnectAccountForm({
  submitLabel,
  onConnected,
}: ConnectAccountFormProps) {
  const router = useRouter();
  const { execute, isPending } = useServerAction(connectAccount);
  const [error, setError] = useState<string | null>(null);
  const methods = useForm<ConnectAccountFormValues>({
    resolver: zodResolver(connectAccountSchema),
    defaultValues: { apiKey: '' },
  });

  async function onSubmit(values: ConnectAccountFormValues) {
    setError(null);
    const [, actionError] = await execute(values);
    if (actionError) {
      setError(actionError.message);
      return;
    }
    router.refresh();
    onConnected?.();
  }

  return (
    <Form {...methods}>
      <form
        onSubmit={methods.handleSubmit(onSubmit)}
        noValidate
        className="flex flex-col gap-3"
      >
        <ApiKeyField disabled={isPending} />
        <FormError message={error} />
        <Button type="submit" disabled={isPending}>
          {isPending ? 'Conectando…' : submitLabel}
        </Button>
      </form>
    </Form>
  );
}
