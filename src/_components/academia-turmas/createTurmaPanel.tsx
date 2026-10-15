'use client';

import { createTurma } from '@/_actions/academia/turmas/createTurma';
import { Button } from '@/_components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/_components/ui/dialog';
import { Form } from '@/_components/ui/form';
import { FormError } from '@/_components/students/formError';
import type { AcademiaEmployment } from '@/_types/academia';
import {
  createTurmaSchema,
  type CreateTurmaFormData,
  type CreateTurmaFormInput,
} from '@/_schema/turmas';
import { zodResolver } from '@hookform/resolvers/zod';
import { Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm, type Resolver } from 'react-hook-form';
import { useServerAction } from 'zsa-react';
import { TurmaFormFields } from './turmaFormFields';

const DEFAULT_VALUES: CreateTurmaFormInput = {
  name: '',
  weekday: 1,
  startTime: '08:00',
  durationMinutes: 60,
  capacity: 10,
  professionalId: '',
};

interface CreateTurmaPanelProps {
  employments: AcademiaEmployment[];
}

export function CreateTurmaPanel({ employments }: CreateTurmaPanelProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const action = useServerAction(createTurma);
  const methods = useForm<CreateTurmaFormInput, unknown, CreateTurmaFormData>({
    resolver: zodResolver(createTurmaSchema) as Resolver<
      CreateTurmaFormInput,
      unknown,
      CreateTurmaFormData
    >,
    defaultValues: DEFAULT_VALUES,
  });

  async function submit(values: CreateTurmaFormData) {
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
          Nova turma
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Criar turma</DialogTitle>
        </DialogHeader>
        <Form {...methods}>
          <form
            onSubmit={methods.handleSubmit(submit)}
            className="flex flex-col gap-3"
            noValidate
          >
            <TurmaFormFields
              control={methods.control}
              disabled={action.isPending}
              includeEducatorPicker
              employments={employments}
            />
            <FormError message={action.isError ? action.error.message : null} />
            <Button type="submit" disabled={action.isPending}>
              {action.isPending ? 'Criando...' : 'Criar turma'}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
