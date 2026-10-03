'use client';

import { Button } from '@/_components/ui/button';
import { Form } from '@/_components/ui/form';
import {
  registerStudentSchema,
  type RegisterStudentData,
  type StudentFormValues,
} from '@/_schema/students';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, type Resolver } from 'react-hook-form';
import { FormError } from './formError';
import {
  StudentBirthDateField,
  StudentNameField,
  StudentPhoneField,
} from './studentFormFields';

interface AddStudentRegisterStepProps {
  email: string;
  isPending: boolean;
  error: string | null;
  onSubmit: (values: RegisterStudentData) => void;
  onEditEmail: () => void;
}

/** Step 2b: register a student who has no account (name and e-mail required). */
export function AddStudentRegisterStep({
  email,
  isPending,
  error,
  onSubmit,
  onEditEmail,
}: AddStudentRegisterStepProps) {
  const methods = useForm<StudentFormValues, unknown, RegisterStudentData>({
    resolver: zodResolver(registerStudentSchema) as Resolver<
      StudentFormValues,
      unknown,
      RegisterStudentData
    >,
    defaultValues: { name: '', email, phone: '', birthDate: '' },
  });

  return (
    <Form {...methods}>
      <form
        className="flex flex-col gap-3"
        onSubmit={methods.handleSubmit(onSubmit)}
        noValidate
      >
        <p className="text-sm">
          <span className="text-muted-foreground">E-mail: </span>
          <span className="font-medium">{email}</span>{' '}
          <Button
            type="button"
            variant="link"
            className="h-auto p-0"
            onClick={onEditEmail}
            disabled={isPending}
          >
            Alterar e-mail
          </Button>
        </p>
        <StudentNameField disabled={isPending} />
        <StudentPhoneField disabled={isPending} />
        <StudentBirthDateField disabled={isPending} />
        <FormError message={error} />
        <Button type="submit" disabled={isPending}>
          {isPending ? 'Cadastrando…' : 'Cadastrar sem conta de usuário'}
        </Button>
      </form>
    </Form>
  );
}
