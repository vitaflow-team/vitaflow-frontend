'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useRef } from 'react';

interface PlanSessionSyncProps {
  /**
   * A sessão está atrasada em relação ao perfil (`isSessionPlanStale`) ou o
   * usuário acabou de voltar do checkout. Decidido no servidor, onde o perfil
   * fresco está disponível (ADR-008).
   */
  stale: boolean;
}

/**
 * Traz as claims de plano da sessão para o que o servidor já sabe: um
 * `update()` (que relê `GET /profile` no callback, ignorando dado do cliente) e
 * depois um `router.refresh()`, para o menu, as rotas e o Início seguirem o
 * novo plano sem novo login (ADR-004, ADR-008).
 *
 * A guarda por `ref` é o que impede o laço: o `refresh()` renderiza a página de
 * novo e, sem ela, o efeito dispararia outro `update()` a cada volta — e em
 * modo estrito já na primeira montagem.
 */
export function PlanSessionSync({ stale }: PlanSessionSyncProps) {
  const { update } = useSession();
  const router = useRouter();
  const synced = useRef(false);

  useEffect(() => {
    if (!stale || synced.current) {
      return;
    }
    synced.current = true;

    let active = true;

    // Falha de rede não pode travar a tela: o callback mantém as claims
    // antigas e o refresh ainda traz o que o servidor já gravou.
    void Promise.resolve(update())
      .catch(() => undefined)
      .then(() => {
        if (active) {
          router.refresh();
        }
      });

    return () => {
      active = false;
    };
  }, [stale, update, router]);

  return null;
}
