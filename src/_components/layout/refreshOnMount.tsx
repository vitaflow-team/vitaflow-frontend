'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useRef } from 'react';

/**
 * Força uma releitura do layout do app depois que a página já renderizou. Serve
 * para o caso em que a página atualizou dados que o layout leu antes (o plano
 * sincronizado na volta do checkout, ADR-006).
 *
 * A guarda é necessária: em modo estrito o efeito roda duas vezes na montagem,
 * e um `router.refresh()` a cada execução vira laço de atualização.
 */
export function RefreshOnMount() {
  const router = useRouter();
  const refreshed = useRef(false);

  useEffect(() => {
    if (refreshed.current) return;
    refreshed.current = true;
    router.refresh();
  }, [router]);

  return null;
}
