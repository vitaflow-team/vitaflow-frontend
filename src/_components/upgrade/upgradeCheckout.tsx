'use client';

import { actionCreateCheckoutSession } from '@/_actions/stripe/createCheckoutSession';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/_components/ui/dialog';
import { useAlertHook } from '@/_hooks/alert_hook';
import { Loader2 } from 'lucide-react';
import { useState } from 'react';
import { Button } from '../ui/button';

interface UpgradeCheckoutProps {
  productId: string;
}

export function UpgradeCheckout({ productId }: UpgradeCheckoutProps) {
  const [loading, setLoading] = useState(false);
  const { openError } = useAlertHook();

  const handleSubscribe = async () => {
    setLoading(true);
    try {
      const [data, err] = await actionCreateCheckoutSession({
        productId,
      });

      if (err) {
        openError(
          err.message || 'Erro ao iniciar o checkout.',
          'Atenção!',
          'error'
        );
        return;
      }

      if (data?.url) {
        window.location.href = data.url;
      } else {
        openError('URL de redirecionamento inválida.', 'Atenção!', 'error');
      }
    } catch {
      openError('Ocorreu um erro inesperado.', 'Atenção!', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger className="flex rounded-md rounded-t-none w-full bg-primary ">
        <span className="p-2 w-full text-secondary">Escolher este plano</span>
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
            onClick={handleSubscribe}
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processando...
              </>
            ) : (
              'Ir para Pagamento'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
