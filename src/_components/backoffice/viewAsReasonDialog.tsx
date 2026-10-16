'use client';

import { startViewAs } from '@/_actions/backoffice/startViewAs';
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
import { useAlertHook } from '@/_hooks/alertHook';
import { useRouter } from 'next/navigation';
import { useId, useState } from 'react';
import { useServerAction } from 'zsa-react';

interface ReasonFieldProps {
  value: string;
  disabled: boolean;
  onChange: (value: string) => void;
}

function ReasonField({ value, disabled, onChange }: ReasonFieldProps) {
  const reasonId = useId();

  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor={reasonId}>Motivo do acesso</Label>
      <Textarea
        id={reasonId}
        maxLength={500}
        value={value}
        disabled={disabled}
        onChange={event => onChange(event.target.value)}
        className="min-h-24"
      />
    </div>
  );
}

interface ViewAsTarget {
  targetKind: 'USER' | 'ACADEMIA_STAFF';
  targetId: string;
  targetLabel: string;
}

interface ViewAsConfirmBodyProps extends ViewAsTarget {
  onConfirmed: () => void;
}

function useStartViewAsConfirm(target: ViewAsTarget, onConfirmed: () => void) {
  const router = useRouter();
  const { openError } = useAlertHook();
  const { execute, isPending } = useServerAction(startViewAs);
  const [reason, setReason] = useState('');
  const canConfirm = reason.trim().length > 0 && !isPending;

  async function confirm() {
    if (!canConfirm) return;
    const [, error] = await execute({ ...target, reason: reason.trim() });
    if (error) {
      openError(error.message, 'Atenção!', 'error');
      return;
    }
    onConfirmed();
    router.push('/restrict');
    router.refresh();
  }

  return { reason, setReason, isPending, canConfirm, confirm };
}

function ViewAsConfirmBody({
  targetKind,
  targetId,
  targetLabel,
  onConfirmed,
}: ViewAsConfirmBodyProps) {
  const { reason, setReason, isPending, canConfirm, confirm } =
    useStartViewAsConfirm({ targetKind, targetId, targetLabel }, onConfirmed);

  return (
    <>
      <AlertDialogHeader>
        <AlertDialogTitle>Ver como {targetLabel}?</AlertDialogTitle>
        <AlertDialogDescription>
          Você verá exatamente o que esta conta vê, em modo somente leitura, por
          até 30 minutos. Informe o motivo do acesso para continuar.
        </AlertDialogDescription>
      </AlertDialogHeader>
      <ReasonField value={reason} disabled={isPending} onChange={setReason} />
      <AlertDialogFooter>
        <AlertDialogCancel disabled={isPending}>Cancelar</AlertDialogCancel>
        <AlertDialogAction
          onSelect={event => event.preventDefault()}
          onClick={confirm}
          disabled={!canConfirm}
        >
          Iniciar sessão
        </AlertDialogAction>
      </AlertDialogFooter>
    </>
  );
}

/** Mandatory-reason gate before a "ver como" session starts (US-003, US-003.EC-1). */
export function ViewAsReasonDialog(props: ViewAsTarget) {
  const [open, setOpen] = useState(false);

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button variant="outline" size="sm">
          Ver como
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <ViewAsConfirmBody {...props} onConfirmed={() => setOpen(false)} />
      </AlertDialogContent>
    </AlertDialog>
  );
}
