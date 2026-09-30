'use client';

import { actionGiveConsent } from '@/_actions/progressPhotos/giveConsent';
import { Button } from '@/_components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/_components/ui/card';
import { useAlertHook } from '@/_hooks/alertHook';
import { useRouter } from 'next/navigation';
import { useServerAction } from 'zsa-react';

// The dedicated, feature-specific LGPD consent screen (ADR-002) — distinct
// from the generic signup consent, and the first place in the product
// where a consent flag is actually checked and enforced (US-001).
export function ConsentGate() {
  const router = useRouter();
  const { openError } = useAlertHook();
  const { isPending, execute } = useServerAction(actionGiveConsent);

  async function accept() {
    const [, error] = await execute();
    if (error) {
      openError(error.message, 'Não foi possível concluir', 'error');
      return;
    }
    router.refresh();
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Antes de começar</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <p className="text-sm text-muted-foreground">
          Para usar fotos de progresso, coletamos e armazenamos fotos do seu
          corpo que você mesmo escolher enviar. Elas ficam guardadas de forma
          privada e só são exibidas para você — nenhum outro usuário e nenhum
          profissional vinculado à sua conta tem acesso a elas, sob nenhuma
          circunstância. Cada foto é servida por um link temporário e assinado,
          nunca por um endereço público permanente, e é apagada de verdade
          quando você a exclui.
        </p>
        <p className="text-sm text-muted-foreground">
          Você pode revisitar esta tela a qualquer momento antes de enviar sua
          primeira foto. Não enviaremos nenhuma foto sem a sua confirmação
          explícita.
        </p>
        <Button onClick={accept} disabled={isPending} className="self-start">
          {isPending ? 'Salvando...' : 'Aceito e quero continuar'}
        </Button>
      </CardContent>
    </Card>
  );
}
