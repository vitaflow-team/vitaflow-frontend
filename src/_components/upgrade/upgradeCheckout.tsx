'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/_components/ui/dialog';
import { useStripe } from '@/_hooks/useStripe';
import { Button } from '../ui/button';

interface UpgradeCheckoutProps {
  productId: string;
}

export function UpgradeCheckout({ productId }: UpgradeCheckoutProps) {
  const { createCheckoutSession } = useStripe();

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="w-full">Escolher este plano</Button>
      </DialogTrigger>
      <DialogContent className="border-2 shadow-2xl border-primary w-full sm:w-96">
        <DialogHeader>
          <DialogTitle className="pb-2">Finalizar Assinatura</DialogTitle>
          <DialogDescription className="text-center text-primary/80">
            Você está a um passo de atualizar seu plano.
          </DialogDescription>
        </DialogHeader>
        <p className="flex flex-col items-center gap-4 text-center text-sm text-primary/70">
          Clique no botão abaixo para ser redirecionado ao nosso parceiro de
          pagamentos seguro.
        </p>
        <DialogFooter className="flex flex-row w-full items-center content-center justify-center">
          <Button
            className="px-5 font-semibold w-full"
            onClick={() => createCheckoutSession(productId)}
          >
            Ir para Pagamento
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
