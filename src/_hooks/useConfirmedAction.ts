'use client';

import { useState } from 'react';

interface Failure {
  message: string;
}

type Execute<I, T> = (input: I) => Promise<[T, Failure | null]>;

/**
 * Runs a destructive server action behind a confirmation dialog: the failure
 * message stays in the dialog (cleared when it reopens) and `onDone` runs only
 * after the action succeeds, with the action's own success data.
 */
export function useConfirmedAction<I, T = unknown>(
  execute: Execute<I, T>,
  input: I,
  onDone: (data: T) => void
) {
  const [error, setError] = useState<string | null>(null);

  async function run() {
    const [data, failure] = await execute(input);
    if (failure) setError(failure.message);
    else onDone(data);
  }

  return { error, run, clearError: () => setError(null) };
}
