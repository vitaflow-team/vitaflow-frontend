'use client';

import { useDebouncedValue } from '@/_hooks/useDebouncedValue';
import { searchHref } from '@/_lib/studentsList';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

/** Pause after the last keystroke before the address (and the list) changes. */
export const SEARCH_DEBOUNCE_MS = 350;

/**
 * The search text, kept in step with the `q` address parameter: typing updates
 * the address after a pause (back to page 1); an address change that did not
 * come from typing, like "Limpar busca", rewrites the field.
 */
export function useStudentSearch(initialQuery: string) {
  const router = useRouter();
  const [value, setValue] = useState(initialQuery);
  const settled = useDebouncedValue(value, SEARCH_DEBOUNCE_MS);
  const lastSeen = useRef(initialQuery.trim());

  useEffect(() => {
    if (initialQuery.trim() === lastSeen.current) return;

    lastSeen.current = initialQuery.trim();
    setValue(initialQuery);
  }, [initialQuery]);

  useEffect(() => {
    if (settled.trim() === lastSeen.current) return;

    lastSeen.current = settled.trim();
    router.replace(searchHref(settled));
  }, [settled, router]);

  return { value, setValue };
}
