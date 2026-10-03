'use client';

import { useState } from 'react';

interface Failure {
  message: string;
}

type Execute<I> = (input: I) => Promise<[unknown, Failure | null]>;

/**
 * Runs a destructive server action behind a confirmation dialog: the failure
 * message stays in the dialog (cleared when it reopens) and `onDone` runs only
 * after the action succeeds.
 */
export function useConfirmedAction<I>(
  execute: Execute<I>,
  input: I,
  onDone: () => void
) {
  const [error, setError] = useState<string | null>(null);

  async function run() {
    const [, failure] = await execute(input);
    if (failure) setError(failure.message);
    else onDone();
  }

  return { error, run, clearError: () => setError(null) };
}
