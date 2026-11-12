import 'server-only';

import { apiClient } from '@/_lib/apiClient';
import { AppError } from '@/_lib/AppError';
import type { LoadFailure } from '@/_types/loadFailure';
import type { AcademiaMembership } from '@/_types/academiaMirror';
import { unstable_rethrow } from 'next/navigation';

function toFailure(error: unknown): LoadFailure {
  unstable_rethrow(error);
  const status = error instanceof AppError ? error.statusCode : undefined;
  if (status === 401 || status === 403) return 'forbidden';
  console.error('Academia mirror: failed to load.', { status });
  return 'failed';
}

export async function loadAcademiaMirror(): Promise<
  AcademiaMembership[] | LoadFailure
> {
  try {
    return await apiClient<AcademiaMembership[]>('/me/academia', {
      method: 'GET',
      cache: 'no-store',
    });
  } catch (error) {
    return toFailure(error);
  }
}

export function isLoadFailure<T>(
  result: T | LoadFailure
): result is LoadFailure {
  return typeof result === 'string';
}
