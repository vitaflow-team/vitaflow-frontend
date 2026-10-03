'use client';

import { Button } from '@/_components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/_components/ui/form';
import { Input } from '@/_components/ui/input';
import { lookupInputSchema } from '@/_schema/students';
import { zodResolver } from '@hookform/resolvers/zod';
import { Mail } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { FormError } from './formError';

interface AddStudentEmailStepProps {
  defaultEmail: string;
  isPending: boolean;
  error: string | null;
  onSubmit: (email: string) => void;
}

/** Step 1: the e-mail decides whether the student may be linked to an account. */
export function AddStudentEmailStep({
  defaultEmail,
  isPending,
  error,
  onSubmit,
}: AddStudentEmailStepProps) {
  const methods = useForm<{ email: string }>({
    resolver: zodResolver(lookupInputSchema),
    defaultValues: { email: defaultEmail },
  });

  return (
    <Form {...methods}>
      <form
        className="flex flex-col gap-3"
        onSubmit={methods.handleSubmit(values => onSubmit(values.email))}
        noValidate
      >
        <FormField
          control={methods.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel showMessage={false}>E-mail do aluno</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type="email"
                  inputMode="email"
                  autoComplete="off"
                  icon={Mail}
                  required
                  aria-required="true"
                  disabled={isPending}
                />
              </FormControl>
              <FormMessage role="alert" />
            </FormItem>
          )}
        />
        <FormError message={error} />
        <Button type="submit" disabled={isPending}>
          {isPending ? 'Verificando…' : 'Continuar'}
        </Button>
      </form>
    </Form>
  );
}
