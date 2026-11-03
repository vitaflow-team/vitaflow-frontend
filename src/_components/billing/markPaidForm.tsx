'use client';

import { markPaidInvoice } from '@/_actions/billing/markPaidInvoice';
import { FormError } from '@/_components/students/formError';
import { Button } from '@/_components/ui/button';
import { Form } from '@/_components/ui/form';
import { todayInBrazil } from '@/_lib/studentsDates';
import { type MarkPaidFormValues, markPaidSchema } from '@/_schema/billing';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useServerAction } from 'zsa-react';
import { NoteField } from './noteField';
import { PaidOnField } from './paidOnField';

interface MarkPaidFormProps {
  invoiceId: string;
  onDone: () => void;
}

/** Records a payment received outside the gateway (US-007). */
export function MarkPaidForm({ invoiceId, onDone }: MarkPaidFormProps) {
  const router = useRouter();
  const { execute, isPending } = useServerAction(markPaidInvoice);
  const [error, setError] = useState<string | null>(null);
  const methods = useForm<MarkPaidFormValues>({
    resolver: zodResolver(markPaidSchema),
    defaultValues: { paidOn: todayInBrazil(), note: '' },
  });

  async function onSubmit(values: MarkPaidFormValues) {
    setError(null);
    const [, actionError] = await execute({ id: invoiceId, ...values });
    if (actionError) {
      setError(actionError.message);
      return;
    }
    router.refresh();
    onDone();
  }

  return (
    <Form {...methods}>
      <form
        onSubmit={methods.handleSubmit(onSubmit)}
        noValidate
        className="flex flex-col gap-3"
      >
        <PaidOnField disabled={isPending} />
        <NoteField disabled={isPending} />
        <FormError message={error} />
        <Button type="submit" disabled={isPending}>
          {isPending ? 'Salvando…' : 'Marcar como paga'}
        </Button>
      </form>
    </Form>
  );
}
