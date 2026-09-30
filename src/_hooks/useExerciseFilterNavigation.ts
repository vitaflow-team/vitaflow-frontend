'use client';

import { toAddressQuery, withFilterChange } from '@/_lib/exerciseFilter';
import type { ExerciseFilter } from '@/_types/exerciseFilter';
import type { ExerciseFilterChange } from '@/_types/exerciseFilterChange';
import { useRouter } from 'next/navigation';
import { useTransition } from 'react';

/**
 * The filters live in the address bar: a change rewrites the query inside a
 * transition, so the Server Component reloads the list without a full
 * navigation or a scroll jump. A change that leaves the address as it is
 * (typing a trailing space, for instance) does nothing.
 */
export function useExerciseFilterNavigation(
  filter: ExerciseFilter,
  basePath: string
) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function apply(change: ExerciseFilterChange) {
    const next = toAddressQuery(withFilterChange(filter, change));
    if (next === toAddressQuery(withFilterChange(filter, {}))) return;

    startTransition(() => {
      router.replace(`${basePath}${next}`, { scroll: false });
    });
  }

  return { apply, isPending };
}
