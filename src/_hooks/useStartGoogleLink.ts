'use client';

import { actionStartGoogleLink } from '@/_actions/users/startGoogleLink';
import { useRef } from 'react';
import { useServerAction } from 'zsa-react';

/**
 * Starts "Conectar Google". Success never returns here: the action leaves
 * for Google with a redirect, so only the failure path continues.
 */
export function useStartGoogleLink() {
  const { execute, isPending, error } = useServerAction(actionStartGoogleLink);
  // `isPending` only arrives on the next render; two clicks in the same tick
  // would otherwise both get through and ask for two intents (US-005.EC-4).
  const running = useRef(false);

  async function start(password?: string): Promise<void> {
    if (running.current) return;
    running.current = true;
    try {
      await execute(password ? { password } : {});
    } finally {
      running.current = false;
    }
  }

  return { start, isPending, errorMessage: error ? error.message : null };
}
