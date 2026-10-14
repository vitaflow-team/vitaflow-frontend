'use client';

import { updateStudent } from '@/_actions/students/updateStudent';
import { Button } from '@/_components/ui/button';
import { Form } from '@/_components/ui/form';
import {
  editStudentSchema,
  type EditStudentData,
  type StudentFormValues,
} from '@/_schema/students';
import type { Student } from '@/_types/students';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm, type Resolver } from 'react-hook-form';
import { useServerAction } from 'zsa-react';
import { AddStudentConfirmStep } from './addStudentConfirmStep';
import { FormError } from './formError';
import {
  StudentBirthDateField,
  StudentEmailField,
  StudentNameField,
  StudentPhoneField,
} from './studentFormFields';

interface EditStudentFormProps {
  student: Student;
  onDone: () => void;
}

interface PendingLink {
  data: EditStudentData;
  accountName: string | null;
}

function defaultsOf(student: Student): StudentFormValues {
  return {
    name: student.name,
    email: student.email,
    phone: student.phone,
    birthDate: student.birthDate ?? '',
  };
}

/**
 * Name, phone and birth date; the e-mail only while the student has no account.
 * A new e-mail of an existing account is linked only after the educator confirms it.
 */
export function EditStudentForm({ student, onDone }: EditStudentFormProps) {
  const router = useRouter();
  const action = useServerAction(updateStudent);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState<PendingLink | null>(null);
  const methods = useForm<StudentFormValues, unknown, EditStudentData>({
    resolver: zodResolver(editStudentSchema) as Resolver<
      StudentFormValues,
      unknown,
      EditStudentData
    >,
    defaultValues: defaultsOf(student),
  });

  async function send(data: EditStudentData, linkExistingAccount: boolean) {
    const { email, ...values } = data;
    const [result, failure] = await action.execute({
      id: student.id,
      ...values,
      ...(student.hasAccount ? {} : { email }),
      linkExistingAccount,
    });
    if (failure) {
      setError(failure.message);
      return;
    }
    if (result?.outcome === 'account_exists') {
      setError(null);
      setPending({ data, accountName: result.accountName });
      return;
    }
    router.refresh();
    onDone();
  }

  if (pending) {
    return (
      <AddStudentConfirmStep
        email={pending.data.email ?? ''}
        accountName={pending.accountName}
        isPending={action.isPending}
        error={error}
        onLink={() => send(pending.data, true)}
        onCancel={() => {
          setPending(null);
          setError(null);
        }}
      />
    );
  }

  return (
    <Form {...methods}>
      <form
        className="flex flex-col gap-3"
        onSubmit={methods.handleSubmit(data => send(data, false))}
        noValidate
      >
        <StudentNameField disabled={action.isPending} />
        <StudentEmailField
          disabled={action.isPending}
          readOnly={student.hasAccount}
        />
        <StudentPhoneField disabled={action.isPending} />
        <StudentBirthDateField disabled={action.isPending} />
        <FormError message={error} />
        <Button type="submit" disabled={action.isPending}>
          {action.isPending ? 'Salvando…' : 'Salvar'}
        </Button>
      </form>
    </Form>
  );
}
