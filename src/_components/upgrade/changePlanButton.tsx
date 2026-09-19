'use client';

import { actionChangeSubscriptionPlan } from '@/_actions/stripe/changeSubscriptionPlan';
import { useAlertHook } from '@/_hooks/alertHook';
import { useRouter } from 'next/navigation';
import { useServerAction } from 'zsa-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/_components/ui/dialog';
import { Button } from '../ui/button';

interface ChangePlanButtonProps {
  productId: string;
  planName: string;
}

export function ChangePlanButton({
  productId,
  planName,
}: ChangePlanButtonProps) {
  const { isPending, execute } = useServerAction(actionChangeSubscriptionPlan);
  const { openError } = useAlertHook();
  const router = useRouter();

  async function handleChange() {
    const [, error] = await execute({ productId });
    if (error) {
      openError(
        error.message || 'Erro ao trocar de plano.',
        'Atenção!',
        'error'
      );
      return;
    }
    openError(
      `Seu plano foi alterado para ${planName}.`,
      'Plano atualizado!',
      'success'
    );
    router.refresh();
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full">
          Trocar para este plano
        </Button>
      </DialogTrigger>
      <DialogContent className="border-2 shadow-2xl border-primary w-full sm:w-96">
        <DialogHeader>
          <DialogTitle className="pb-2">Trocar de plano</DialogTitle>
          <DialogDescription className="text-center text-primary/80">
            Sua assinatura atual será atualizada para {planName}. A cobrança é
            ajustada proporcionalmente (pro-rata) no seu próximo boleto.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex flex-row w-full items-center content-center justify-center">
          <Button
            className="px-5 font-semibold w-full"
            onClick={handleChange}
            disabled={isPending}
          >
            {isPending ? 'Atualizando…' : 'Confirmar troca'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
