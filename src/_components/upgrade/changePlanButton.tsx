'use client';

import { actionChangeSubscriptionPlan } from '@/_actions/stripe/changeSubscriptionPlan';
import { useAlertHook } from '@/_hooks/alertHook';
import type { PlanChangeSummary as PlanChangeResult } from '@/_lib/planChangeSummary';
import type { PlanType } from '@/_lib/planSelection';
import { useRouter } from 'next/navigation';
import { useRef } from 'react';
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
import { PlanChangeSummary } from './planChangeSummary';

interface ChangePlanButtonProps {
  productId: string;
  planName: string;
  /** Resumo da troca; `null` ou ausente esconde o bloco (ADR-010). */
  summary?: PlanChangeResult | null;
  currentPlanName?: string;
  currentType?: PlanType;
  targetType?: PlanType;
}

export function ChangePlanButton({
  productId,
  planName,
  summary = null,
  currentPlanName,
  currentType,
  targetType,
}: ChangePlanButtonProps) {
  const { isPending, execute } = useServerAction(actionChangeSubscriptionPlan);
  const { openError } = useAlertHook();
  const router = useRouter();
  // `isPending` só chega no render seguinte; dois cliques no mesmo tique
  // mandariam duas trocas (US-005.EC-2).
  const running = useRef(false);

  async function handleChange() {
    if (isPending || running.current) {
      return;
    }
    running.current = true;

    try {
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
    } finally {
      running.current = false;
    }
  }

  const showSummary = summary && currentPlanName && currentType && targetType;

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
            Confira o que muda antes de confirmar.
          </DialogDescription>
        </DialogHeader>
        {showSummary ? (
          <PlanChangeSummary
            summary={summary}
            currentPlanName={currentPlanName}
            targetPlanName={planName}
            currentType={currentType}
            targetType={targetType}
          />
        ) : (
          <p className="text-center text-sm text-primary/70">
            Sua assinatura atual será atualizada para {planName}. A cobrança é
            ajustada proporcionalmente (pro-rata) no seu próximo boleto.
          </p>
        )}
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
