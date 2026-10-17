'use client';

import { FormError } from '@/_components/students/formError';
import { Button } from '@/_components/ui/button';
import { Form } from '@/_components/ui/form';
import { createPatient } from '@/_actions/patients/createPatient';
import {
  registerPatientSchema,
  type PatientFormValues,
  type RegisterPatientData,
} from '@/_schema/patients';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm, type Resolver } from 'react-hook-form';
import { useServerAction } from 'zsa-react';
import {
  PatientEmailField,
  PatientNameField,
  PatientPhoneField,
} from './patientFormFields';

interface AddPatientFormProps {
  onDone: () => void;
}

/**
 * Registers a patient in one step (name + e-mail/phone): the backend
 * auto-links a matching confirmed account immediately, with no separate
 * lookup/confirm step (task_03's own, simpler contract — unlike the
 * physical educator's wizard).
 */
export function AddPatientForm({ onDone }: AddPatientFormProps) {
  const router = useRouter();
  const { execute, isPending } = useServerAction(createPatient);
  const [error, setError] = useState<string | null>(null);

  const methods = useForm<PatientFormValues, unknown, RegisterPatientData>({
    resolver: zodResolver(registerPatientSchema) as Resolver<
      PatientFormValues,
      unknown,
      RegisterPatientData
    >,
    defaultValues: { name: '', email: '', phone: '' },
  });

  async function onSubmit(values: RegisterPatientData) {
    setError(null);
    const [, actionError] = await execute(values);
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
        className="flex flex-col gap-3"
        onSubmit={methods.handleSubmit(onSubmit)}
        noValidate
      >
        <PatientNameField disabled={isPending} />
        <PatientEmailField disabled={isPending} />
        <PatientPhoneField disabled={isPending} />
        <FormError message={error} />
        <Button type="submit" disabled={isPending}>
          {isPending ? 'Cadastrando…' : 'Cadastrar paciente'}
        </Button>
      </form>
    </Form>
  );
}
