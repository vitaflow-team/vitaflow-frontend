'use client';

import { registerAcademiaStudent } from '@/_actions/academia/registerAcademiaStudent';
import { Button } from '@/_components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/_components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from '@/_components/ui/form';
import { Input } from '@/_components/ui/input';
import { FormError } from '@/_components/students/formError';
import type { AcademiaEmployment } from '@/_types/academia';
import {
  registerAcademiaStudentSchema,
  type RegisterAcademiaStudentData,
  type RegisterAcademiaStudentFormValues,
} from '@/_schema/academiaAlunos';
import { zodResolver } from '@hookform/resolvers/zod';
import { Mail, Plus, User } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm, type Resolver } from 'react-hook-form';
import { useServerAction } from 'zsa-react';

const UNASSIGNED = '';

const DEFAULT_VALUES: RegisterAcademiaStudentFormValues = {
  name: '',
  email: '',
  phone: '',
  birthDate: '',
  professionalId: UNASSIGNED,
};

interface RegisterStudentPanelProps {
  employments: AcademiaEmployment[];
}

export function RegisterStudentPanel({
  employments,
}: RegisterStudentPanelProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const action = useServerAction(registerAcademiaStudent);
  const methods = useForm<
    RegisterAcademiaStudentFormValues,
    unknown,
    RegisterAcademiaStudentData
  >({
    resolver: zodResolver(registerAcademiaStudentSchema) as Resolver<
      RegisterAcademiaStudentFormValues,
      unknown,
      RegisterAcademiaStudentData
    >,
    defaultValues: DEFAULT_VALUES,
  });

  async function submit(values: RegisterAcademiaStudentData) {
    const [, error] = await action.execute({
      ...values,
      professionalId: values.professionalId || undefined,
    });
    if (!error) {
      methods.reset(DEFAULT_VALUES);
      setOpen(false);
      router.refresh();
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus aria-hidden="true" />
          Novo aluno
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Cadastrar aluno da academia</DialogTitle>
          <DialogDescription>
            Atribua um educador agora, ou deixe sem educador para atribuir
            depois.
          </DialogDescription>
        </DialogHeader>
        <Form {...methods}>
          <form
            onSubmit={methods.handleSubmit(submit)}
            className="flex flex-col gap-3"
            noValidate
          >
            <FormField
              control={methods.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome</FormLabel>
                  <FormControl>
                    <Input {...field} icon={User} disabled={action.isPending} />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={methods.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>E-mail</FormLabel>
                  <FormControl>
                    <Input {...field} icon={Mail} disabled={action.isPending} />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={methods.control}
              name="professionalId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Atribuir a</FormLabel>
                  <FormControl>
                    <select
                      {...field}
                      disabled={action.isPending}
                      className="h-10 rounded-md border border-input bg-background px-3 text-sm"
                    >
                      <option value={UNASSIGNED}>Sem educador</option>
                      {employments.map(employment => (
                        <option
                          key={employment.educatorId}
                          value={employment.educatorId}
                        >
                          {employment.educator.name}
                        </option>
                      ))}
                    </select>
                  </FormControl>
                </FormItem>
              )}
            />
            <FormError message={action.isError ? action.error.message : null} />
            <Button type="submit" disabled={action.isPending}>
              {action.isPending ? 'Cadastrando...' : 'Cadastrar aluno'}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
