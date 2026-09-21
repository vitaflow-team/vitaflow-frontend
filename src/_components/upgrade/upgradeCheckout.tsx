'use client';

import { actionCreateCheckoutSession } from '@/_actions/stripe/createCheckoutSession';
import { useAlertHook } from '@/_hooks/alertHook';
import type { PlanChangeSummary as PlanChangeResult } from '@/_lib/planChangeSummary';
import type { PlanType } from '@/_lib/planSelection';
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

interface UpgradeCheckoutProps {
  productId: string;
  /** Nome do plano deste card, usado só no resumo da troca. */
  planName?: string;
  /** Resumo da troca; `null` ou ausente esconde o bloco (ADR-010). */
  summary?: PlanChangeResult | null;
  currentPlanName?: string;
  currentType?: PlanType;
  targetType?: PlanType;
}

export function UpgradeCheckout({
  productId,
  planName,
  summary = null,
  currentPlanName,
  currentType,
  targetType,
}: UpgradeCheckoutProps) {
  const { isPending, execute } = useServerAction(actionCreateCheckoutSession);
  const { openError } = useAlertHook();
  // `isPending` só chega no render seguinte; dois cliques no mesmo tique
  // abririam dois checkouts (US-005.EC-2).
  const running = useRef(false);

  async function handleCheckout() {
    if (isPending || running.current) {
      return;
    }
    running.current = true;

    try {
      const [data, error] = await execute({ productId });
      if (error) {
        openError(
          error.message || 'Erro ao iniciar o pagamento.',
          'Atenção!',
          'error'
        );
        return;
      }
      if (data?.url) {
        window.location.href = data.url;
      }
    } finally {
      running.current = false;
    }
  }

  const showSummary =
    summary && currentPlanName && planName && currentType && targetType;

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="w-full">Escolher este plano</Button>
      </DialogTrigger>
      <DialogContent className="border-2 shadow-2xl border-primary w-full sm:w-96">
        <DialogHeader>
          <DialogTitle className="pb-2">Finalizar Assinatura</DialogTitle>
          <DialogDescription className="text-center text-primary/80">
            Confira o que muda antes de assinar.
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
          <p className="flex flex-col items-center gap-4 text-center text-sm text-primary/70">
            Clique no botão abaixo para ser redirecionado ao nosso parceiro de
            pagamentos seguro.
          </p>
        )}
        <DialogFooter className="flex flex-row w-full items-center content-center justify-center">
          <Button
            className="px-5 font-semibold w-full"
            onClick={handleCheckout}
            disabled={isPending}
          >
            {isPending ? 'Redirecionando…' : 'Ir para Pagamento'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
