'use client';

import { toAddressQuery, withFilterChange } from '@/_lib/professionalFilter';
import { PROFESSIONAL_DISCOVERY_PATH } from '@/_lib/professionalDiscoveryTabs';
import type {
  ProfessionalFilter,
  ProfessionalFilterChange,
} from '@/_types/professionalFilter';
import { useRouter } from 'next/navigation';
import { useTransition } from 'react';

/**
 * The filters live in the address bar: a change rewrites the query inside a
 * transition, so the Server Component reloads the list without a full
 * navigation. Mirrors useExerciseFilterNavigation; always stays on the
 * "buscar" tab.
 */
export function useProfessionalFilterNavigation(filter: ProfessionalFilter) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function apply(change: ProfessionalFilterChange) {
    const next = withFilterChange(filter, change);
    const query = toAddressQuery(next);
    const params = new URLSearchParams(query.slice(1));
    params.set('tab', 'buscar');

    startTransition(() => {
      router.replace(`${PROFESSIONAL_DISCOVERY_PATH}?${params.toString()}`, {
        scroll: false,
      });
    });
  }

  return { apply, isPending };
}
