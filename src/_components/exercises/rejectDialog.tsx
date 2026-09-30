'use client';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/_components/ui/alert-dialog';
import { Button } from '@/_components/ui/button';
import { Label } from '@/_components/ui/label';
import { Textarea } from '@/_components/ui/textarea';
import { useId, useState } from 'react';

interface RejectReasonFieldProps {
  value: string;
  disabled: boolean;
  onChange: (value: string) => void;
}

function RejectReasonField({
  value,
  disabled,
  onChange,
}: RejectReasonFieldProps) {
  const id = useId();

  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor={id}>Motivo (opcional)</Label>
      <Textarea
        id={id}
        maxLength={500}
        value={value}
        disabled={disabled}
        onChange={event => onChange(event.target.value)}
        className="min-h-24"
      />
    </div>
  );
}

interface RejectDialogProps {
  exerciseName: string;
  disabled: boolean;
  onReject: (reason: string) => Promise<boolean>;
}

/** Rejection with an optional reason the educator will read (US-009). */
export function RejectDialog({
  exerciseName,
  disabled,
  onReject,
}: RejectDialogProps) {
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState('');

  async function handleReject() {
    await onReject(reason.trim());
    setOpen(false);
    setReason('');
  }

  return (
    <AlertDialog open={open} onOpenChange={next => !disabled && setOpen(next)}>
      <AlertDialogTrigger asChild>
        <Button variant="outline" disabled={disabled}>
          Recusar
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Recusar “{exerciseName}”?</AlertDialogTitle>
          <AlertDialogDescription>
            A sugestão não entra no catálogo. O educador vê que ela foi
            recusada.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <RejectReasonField
          value={reason}
          disabled={disabled}
          onChange={setReason}
        />
        <AlertDialogFooter>
          <AlertDialogCancel disabled={disabled}>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            onSelect={event => event.preventDefault()}
            onClick={handleReject}
            disabled={disabled}
            className="bg-destructive hover:bg-destructive/90 text-white"
          >
            Recusar sugestão
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
