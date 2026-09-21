'use client';

import { useEffect, useState } from 'react';

/**
 * Espelha `value` depois de `delayMs` parado. Usado para anunciar apenas o
 * peso estabilizado, nunca cada repetição do stepper (ADR-003).
 */
export function useDebouncedValue<T>(value: T, delayMs: number): T {
  const [settled, setSettled] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setSettled(value), delayMs);

    return () => clearTimeout(timer);
  }, [value, delayMs]);

  return settled;
}
