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

function defaultsOf(student: Student): StudentFormValues {
  return {
    name: student.name,
    email: student.email,
    phone: student.phone,
    birthDate: student.birthDate ?? '',
  };
}

/** Name, phone and birth date; the e-mail only while the student has no account. */
export function EditStudentForm({ student, onDone }: EditStudentFormProps) {
  const router = useRouter();
  const action = useServerAction(updateStudent);
  const [error, setError] = useState<string | null>(null);
  const methods = useForm<StudentFormValues, unknown, EditStudentData>({
    resolver: zodResolver(editStudentSchema) as Resolver<
      StudentFormValues,
      unknown,
      EditStudentData
    >,
    defaultValues: defaultsOf(student),
  });

  async function submit({ email, ...values }: EditStudentData) {
    const [, failure] = await action.execute({
      id: student.id,
      ...values,
      ...(student.hasAccount ? {} : { email }),
    });
    if (failure) {
      setError(failure.message);
      return;
    }
    router.refresh();
    onDone();
  }

  return (
    <Form {...methods}>
      <form
        className="flex flex-col gap-3"
        onSubmit={methods.handleSubmit(submit)}
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
