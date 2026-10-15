import 'server-only';

import { apiClient } from '@/_lib/apiClient';
import { AppError } from '@/_lib/AppError';
import type { LoadFailure } from '@/_types/loadFailure';
import type { ProfessoresList } from '@/_types/professores';
import { unstable_rethrow } from 'next/navigation';

function toFailure(error: unknown, source: string): LoadFailure {
  unstable_rethrow(error);
  const status = error instanceof AppError ? error.statusCode : undefined;
  if (status === 401 || status === 403) return 'forbidden';
  console.error(`Professores: ${source} failed.`, { status });
  return 'failed';
}

export function isLoadFailure<T>(
  result: T | LoadFailure
): result is LoadFailure {
  return typeof result === 'string';
}

interface ListInput {
  search?: string;
  page: number;
}

export async function loadProfessores({
  search,
  page,
}: ListInput): Promise<ProfessoresList | LoadFailure> {
  const query = new URLSearchParams({ page: String(page) });
  if (search) query.set('search', search);

  try {
    return await apiClient<ProfessoresList>(
      `/academia/professores?${query.toString()}`,
      { method: 'GET', cache: 'no-store' }
    );
  } catch (error) {
    return toFailure(error, 'list');
  }
}
