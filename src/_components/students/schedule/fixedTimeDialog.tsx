'use client';

import { Button } from '@/_components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/_components/ui/dialog';
import { useFixedTimeForm } from '@/_hooks/useFixedTimeForm';
import type { FixedTime } from '@/_types/educatorSchedule';
import { useState } from 'react';
import { FormError } from '../formError';
import { FixedTimeFormFields } from './fixedTimeFormFields';
import { ScheduleConflictNotice } from './scheduleConflictNotice';

interface FixedTimeDialogProps {
  studentId: string;
  fixedTime: FixedTime | null;
  sessionNames: string[];
  trigger: React.ReactNode;
}

interface FixedTimeDialogBodyProps
  extends Omit<FixedTimeDialogProps, 'trigger'> {
  onDone: () => void;
}

/** The form of one fixed time: add (no `fixedTime`) or change it. */
function FixedTimeDialogBody({
  studentId,
  fixedTime,
  sessionNames,
  onDone,
}: FixedTimeDialogBodyProps) {
  const form = useFixedTimeForm(studentId, fixedTime, onDone);

  return (
    <form
      className="flex flex-col gap-4"
      noValidate
      onSubmit={event => {
        event.preventDefault();
        void form.submit();
      }}
    >
      <FixedTimeFormFields
        draft={form.draft}
        errors={form.errors}
        sessionNames={sessionNames}
        onChange={form.patch}
      />
      {form.conflict && <ScheduleConflictNotice conflict={form.conflict} />}
      <FormError message={form.failure} />
      <Button
        type="submit"
        disabled={form.isPending || (fixedTime !== null && !form.isDirty)}
        aria-describedby={fixedTime && !form.isDirty ? 'no-changes' : undefined}
      >
        {form.isPending ? 'Salvando…' : 'Salvar horário'}
      </Button>
      {fixedTime && !form.isDirty && (
        <p id="no-changes" className="text-xs text-muted-foreground">
          Nada foi alterado.
        </p>
      )}
    </form>
  );
}

/** Adds a fixed time, or changes one; closing with unsaved values asks first. */
export function FixedTimeDialog({
  studentId,
  fixedTime,
  sessionNames,
  trigger,
}: FixedTimeDialogProps) {
  const [open, setOpen] = useState(false);
  const title = fixedTime ? 'Alterar horário fixo' : 'Novo horário fixo';

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-h-[90dvh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            O horário vale a partir de agora: as sessões futuras que ainda não
            começaram são refeitas.
          </DialogDescription>
        </DialogHeader>
        <FixedTimeDialogBody
          studentId={studentId}
          fixedTime={fixedTime}
          sessionNames={sessionNames}
          onDone={() => setOpen(false)}
        />
      </DialogContent>
    </Dialog>
  );
}
