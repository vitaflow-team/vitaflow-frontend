'use client';

import { useAlertHook } from '@/_hooks/alertHook';
import { useRouter } from 'next/navigation';
import { useRef, useState } from 'react';

type MutationResult = Promise<[unknown, { message?: string } | null]>;

const FALLBACK = 'Não foi possível concluir a ação. Tente novamente.';

/**
 * Runs one professional-discovery mutation at a time and reloads the page
 * data after it, success or failure — mirrors useExerciseMutation's shape.
 */
export function useProfessionalDiscoveryMutation() {
  const router = useRouter();
  const { openError } = useAlertHook();
  const [isPending, setIsPending] = useState(false);
  const running = useRef(false);

  async function run(mutation: () => MutationResult, successMessage: string) {
    if (running.current) return false;
    running.current = true;
    setIsPending(true);
    try {
      const [, error] = await mutation();
      if (error) {
        openError(error.message || FALLBACK, 'Atenção!', 'error');
      } else {
        openError(successMessage, 'Pronto!', 'success');
      }
      router.refresh();
      return !error;
    } finally {
      running.current = false;
      setIsPending(false);
    }
  }

  return { run, isPending };
}
