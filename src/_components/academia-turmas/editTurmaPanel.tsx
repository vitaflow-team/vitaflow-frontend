'use client';

import { updateTurma } from '@/_actions/academia/turmas/updateTurma';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/_components/ui/alert-dialog';
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
import { minutesToTime } from '@/_lib/turmaSchedule';
import {
  turmaScheduleSchema,
  type TurmaScheduleFormData,
  type TurmaScheduleFormInput,
} from '@/_schema/turmas';
import type { TurmaAgendaItem } from '@/_types/turmas';
import { zodResolver } from '@hookform/resolvers/zod';
import { Pencil } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm, type Resolver } from 'react-hook-form';
import { useServerAction } from 'zsa-react';
import { TurmaFormFields } from './turmaFormFields';

interface EditTurmaPanelProps {
  turma: TurmaAgendaItem;
}

export function EditTurmaPanel({ turma }: EditTurmaPanelProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [pendingValues, setPendingValues] =
    useState<TurmaScheduleFormData | null>(null);
  const action = useServerAction(updateTurma);
  const methods = useForm<
    TurmaScheduleFormInput,
    unknown,
    TurmaScheduleFormData
  >({
    resolver: zodResolver(turmaScheduleSchema) as Resolver<
      TurmaScheduleFormInput,
      unknown,
      TurmaScheduleFormData
    >,
    defaultValues: {
      name: turma.name,
      weekday: turma.weekday,
      startTime: minutesToTime(turma.startMinute),
      durationMinutes: turma.durationMinutes,
      capacity: turma.capacity,
    },
  });

  async function doSubmit(values: TurmaScheduleFormData) {
    const [, error] = await action.execute({ ...values, turmaId: turma.id });
    if (!error) {
      setOpen(false);
      setPendingValues(null);
      router.refresh();
    }
  }

  function handleSubmit(values: TurmaScheduleFormData) {
    if (values.capacity < turma.enrolledCount) {
      setPendingValues(values);
      return;
    }
    void doSubmit(values);
  }

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm">
            <Pencil aria-hidden="true" />
            Editar
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar turma</DialogTitle>
          </DialogHeader>
          <Form {...methods}>
            <form
              onSubmit={methods.handleSubmit(handleSubmit)}
              className="flex flex-col gap-3"
              noValidate
            >
              <TurmaFormFields
                control={methods.control}
                disabled={action.isPending}
              />
              <FormError
                message={action.isError ? action.error.message : null}
              />
              <Button type="submit" disabled={action.isPending}>
                {action.isPending ? 'Salvando...' : 'Salvar'}
              </Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <AlertDialog
        open={pendingValues !== null}
        onOpenChange={isOpen => !isOpen && setPendingValues(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Reduzir a capacidade?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta turma tem {turma.enrolledCount}{' '}
              {turma.enrolledCount === 1
                ? 'aluno inscrito'
                : 'alunos inscritos'}
              . Reduzir a capacidade não remove ninguém, mas impede novas
              inscrições até que haja vagas.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <FormError message={action.isError ? action.error.message : null} />
          <AlertDialogFooter>
            <AlertDialogCancel disabled={action.isPending}>
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => pendingValues && doSubmit(pendingValues)}
              disabled={action.isPending}
            >
              Confirmar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
