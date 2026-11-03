'use client';

import { setTaxId } from '@/_actions/billing/setTaxId';
import { FormError } from '@/_components/students/formError';
import { Button } from '@/_components/ui/button';
import { Form } from '@/_components/ui/form';
import { type SetTaxIdFormValues, setTaxIdSchema } from '@/_schema/billing';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useServerAction } from 'zsa-react';
import { TaxIdField } from './taxIdField';

interface ReplaceTaxIdFormProps {
  clientId: string;
  onDone: () => void;
}

/** Replaces the student's stored CPF or CNPJ (US-004.EC-5, UT-127). */
export function ReplaceTaxIdForm({ clientId, onDone }: ReplaceTaxIdFormProps) {
  const router = useRouter();
  const { execute, isPending } = useServerAction(setTaxId);
  const [error, setError] = useState<string | null>(null);
  const methods = useForm<SetTaxIdFormValues>({
    resolver: zodResolver(setTaxIdSchema),
    defaultValues: { cpfCnpj: '' },
  });

  async function onSubmit(values: SetTaxIdFormValues) {
    setError(null);
    const [, actionError] = await execute({ clientId, ...values });
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
        <TaxIdField disabled={isPending} />
        <FormError message={error} />
        <Button type="submit" disabled={isPending}>
          {isPending ? 'Salvando…' : 'Salvar'}
        </Button>
      </form>
    </Form>
  );
}
