'use client';

import { createInvoice } from '@/_actions/billing/createInvoice';
import { FormError } from '@/_components/students/formError';
import { Button } from '@/_components/ui/button';
import { Form } from '@/_components/ui/form';
import { currentCompetence } from '@/_lib/billingDates';
import {
  type CreateInvoiceFormValues,
  createInvoiceSchema,
} from '@/_schema/billing';
import type { Invoice } from '@/_types/billing';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useServerAction } from 'zsa-react';
import { AmountField } from './amountField';
import { CompetenceMonthField } from './competenceMonthField';
import { DueDateField } from './dueDateField';
import { PaymentLinkNotice } from './paymentLinkNotice';
import { TaxIdField } from './taxIdField';

interface InvoiceGenerationPanelProps {
  clientId: string;
  needsTaxId: boolean;
}

function defaultValues(): CreateInvoiceFormValues {
  const { year, month } = currentCompetence();
  return {
    competenceYear: year,
    competenceMonth: month,
    amount: '',
    dueDate: '',
    cpfCnpj: '',
  };
}

interface GenerationFieldsProps {
  disabled: boolean;
  needsTaxId: boolean;
}

function GenerationFields({ disabled, needsTaxId }: GenerationFieldsProps) {
  return (
    <>
      <CompetenceMonthField disabled={disabled} />
      <AmountField disabled={disabled} />
      <DueDateField disabled={disabled} />
      {needsTaxId && <TaxIdField disabled={disabled} />}
    </>
  );
}

/** Generates a new monthly invoice for the student (US-004, UT-125). */
export function InvoiceGenerationPanel({
  clientId,
  needsTaxId,
}: InvoiceGenerationPanelProps) {
  const router = useRouter();
  const { execute, isPending } = useServerAction(createInvoice);
  const [error, setError] = useState<string | null>(null);
  const [created, setCreated] = useState<Invoice | null>(null);
  const methods = useForm<CreateInvoiceFormValues>({
    resolver: zodResolver(createInvoiceSchema),
    defaultValues: defaultValues(),
  });

  async function onSubmit(values: CreateInvoiceFormValues) {
    setError(null);
    setCreated(null);
    const [invoice, actionError] = await execute({
      clientId,
      ...values,
      cpfCnpj: needsTaxId ? values.cpfCnpj : undefined,
    });
    if (actionError) {
      setError(actionError.message);
      return;
    }
    setCreated(invoice);
    methods.reset(defaultValues());
    router.refresh();
  }

  return (
    <Form {...methods}>
      <form
        onSubmit={methods.handleSubmit(onSubmit)}
        noValidate
        className="flex flex-col gap-3 rounded-lg border p-4"
      >
        <h3 className="font-medium">Gerar cobrança</h3>
        <GenerationFields disabled={isPending} needsTaxId={needsTaxId} />
        <FormError message={error} />
        {created?.paymentUrl && created.emailSent === false && (
          <PaymentLinkNotice paymentUrl={created.paymentUrl} />
        )}
        <Button type="submit" disabled={isPending}>
          {isPending ? 'Gerando…' : 'Gerar cobrança'}
        </Button>
      </form>
    </Form>
  );
}
