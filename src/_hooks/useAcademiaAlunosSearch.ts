'use client';

import { useDebouncedValue } from '@/_hooks/useDebouncedValue';
import {
  academiaAlunosSearchHref,
  type HorarioFilter,
} from '@/_lib/academiaAlunosList';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

export const SEARCH_DEBOUNCE_MS = 350;

export function useAcademiaAlunosSearch(
  initialQuery: string,
  horario: HorarioFilter
) {
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
    router.replace(academiaAlunosSearchHref(settled, horario));
  }, [settled, horario, router]);

  return { value, setValue };
}
