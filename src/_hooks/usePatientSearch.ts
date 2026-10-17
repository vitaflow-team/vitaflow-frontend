'use client';

import { useDebouncedValue } from '@/_hooks/useDebouncedValue';
import { searchHref } from '@/_lib/patientsList';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

export const SEARCH_DEBOUNCE_MS = 350;

/**
 * The search text, kept in step with the `q` address parameter: typing
 * updates the address after a pause; an address change that did not come
 * from typing (e.g. "Limpar busca") rewrites the field. Mirrors useStudentSearch.
 */
export function usePatientSearch(initialQuery: string) {
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
