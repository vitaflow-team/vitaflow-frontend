'use client';

import { deleteAccount } from '@/_actions/users/deleteAccount';
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
import { Input } from '@/_components/ui/input';
import { Label } from '@/_components/ui/label';
import { useAlertHook } from '@/_hooks/alertHook';
import { isDeletionConfirmed } from '@/_lib/deleteAccount';
import { useId, useRef, useState } from 'react';
import { useServerAction } from 'zsa-react';

interface DeleteAccountDialogProps {
  email: string;
  /** `null` quando o perfil não trouxe a contagem; `0` para quem não é profissional. */
  clientsCount: number | null;
  /** Só profissionais apagam alunos/pacientes junto com a própria conta. */
  isProfessional: boolean;
  /** Assinatura paga em curso: o período já pago se perde (ADR-005). */
  hasPaidSubscription: boolean;
}

function clientsLine(
  isProfessional: boolean,
  clientsCount: number | null
): string | null {
  if (!isProfessional) {
    return null;
  }

  // Sem contagem não dá para prometer um número, mas calar sobre os alunos
  // seria pior: a frase genérica avisa sem inventar (US-011.EC-1).
  if (clientsCount === null) {
    return 'Seus alunos/pacientes cadastrados também serão apagados.';
  }

  if (clientsCount <= 0) {
    return null;
  }

  return `${clientsCount} ${
    clientsCount === 1
      ? 'aluno/paciente será apagado'
      : 'alunos/pacientes serão apagados'
  }.`;
}

export function DeleteAccountDialog({
  email,
  clientsCount,
  isProfessional,
  hasPaidSubscription,
}: DeleteAccountDialogProps) {
  const { execute, isPending } = useServerAction(deleteAccount);
  const { openError } = useAlertHook();
  const [open, setOpen] = useState(false);
  const [typed, setTyped] = useState('');
  const inputId = useId();
  // `isPending` só chega no render seguinte; dois cliques no mesmo tique
  // passariam os dois pela porta e mandariam duas exclusões (US-009.EC-5).
  const running = useRef(false);

  const confirmed = isDeletionConfirmed(typed, email);
  const clients = clientsLine(isProfessional, clientsCount);

  function handleOpenChange(next: boolean) {
    // Fechar sempre zera o texto: reabrir com o e-mail ainda digitado deixaria
    // o botão definitivo armado de saída (US-009.EC-1).
    if (isPending) {
      return;
    }
    setOpen(next);
    if (!next) {
      setTyped('');
    }
  }

  async function handleDelete() {
    if (!confirmed || isPending || running.current) {
      return;
    }
    running.current = true;

    // Sucesso não volta daqui: a ação termina em `signOut` com redirect, e a
    // navegação acontece antes de qualquer `setState`. Só o caminho de erro
    // continua nesta função, e ele mantém o diálogo aberto para nova tentativa.
    try {
      const [, error] = await execute();

      if (error) {
        openError(
          error.message || 'Não foi possível excluir a conta. Tente novamente.',
          'Atenção!',
          'error'
        );
      }
    } finally {
      running.current = false;
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={handleOpenChange}>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" className="w-full sm:w-fit">
          Excluir conta…
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Excluir sua conta?</AlertDialogTitle>
          <AlertDialogDescription asChild>
            <div className="flex flex-col gap-2 text-left">
              <p>
                Seu perfil, endereço, medidas e histórico de evolução serão
                apagados. <strong>Esta ação não pode ser desfeita.</strong>
              </p>
              {clients && <p>{clients}</p>}
              {hasPaidSubscription && (
                <p>
                  Sua assinatura será cancelada na hora e o tempo já pago do
                  período atual será perdido, sem reembolso.
                </p>
              )}
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="flex flex-col gap-2">
          <Label htmlFor={inputId}>
            Para confirmar, digite seu e-mail: <strong>{email}</strong>
          </Label>
          <Input
            id={inputId}
            type="email"
            autoComplete="off"
            autoCapitalize="none"
            spellCheck={false}
            value={typed}
            disabled={isPending}
            onChange={event => setTyped(event.target.value)}
          />
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            // `onSelect` com preventDefault: o Action do Radix fecha o diálogo
            // sozinho ao ser acionado, e o erro precisa encontrá-lo aberto.
            onSelect={event => event.preventDefault()}
            onClick={handleDelete}
            disabled={!confirmed || isPending}
            className="bg-destructive text-white hover:bg-destructive/90"
          >
            {isPending ? 'Excluindo…' : 'Excluir definitivamente'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
