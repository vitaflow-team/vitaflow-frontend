'use client';

import { updateInvoice } from '@/_actions/billing/updateInvoice';
import { FormError } from '@/_components/students/formError';
import { Button } from '@/_components/ui/button';
import { Form } from '@/_components/ui/form';
import {
  type UpdateInvoiceFormValues,
  updateInvoiceSchema,
} from '@/_schema/billing';
import type { Invoice } from '@/_types/billing';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { useServerAction } from 'zsa-react';
import { AmountField } from './amountField';
import { DueDateField } from './dueDateField';

interface EditInvoiceFormProps {
  invoice: Invoice;
  onDone: () => void;
}

function toAmountInput(cents: number): string {
  return (cents / 100).toFixed(2).replace('.', ',');
}

/** Edits the amount or due date of an open invoice (US-005). */
export function EditInvoiceForm({ invoice, onDone }: EditInvoiceFormProps) {
  const router = useRouter();
  const { execute, isPending } = useServerAction(updateInvoice);
  const [error, setError] = useState<string | null>(null);
  const initial = {
    amount: toAmountInput(invoice.amountCents),
    dueDate: invoice.dueDate,
  };
  const methods = useForm<UpdateInvoiceFormValues>({
    resolver: zodResolver(updateInvoiceSchema),
    defaultValues: initial,
  });
  const values = useWatch({ control: methods.control });
  const unchanged =
    values.amount === initial.amount && values.dueDate === initial.dueDate;

  async function onSubmit(values: UpdateInvoiceFormValues) {
    setError(null);
    const [, actionError] = await execute({ id: invoice.id, ...values });
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
        <AmountField disabled={isPending} />
        <DueDateField disabled={isPending} />
        <FormError message={error} />
        <Button type="submit" disabled={isPending || unchanged}>
          {isPending ? 'Salvando…' : 'Salvar alterações'}
        </Button>
      </form>
    </Form>
  );
}
