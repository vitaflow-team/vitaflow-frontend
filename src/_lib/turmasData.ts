import 'server-only';

import { apiClient } from '@/_lib/apiClient';
import { AppError } from '@/_lib/AppError';
import type { AcademiaEmployment } from '@/_types/academia';
import type { LoadFailure } from '@/_types/loadFailure';
import type { TurmaAgendaItem } from '@/_types/turmas';
import { unstable_rethrow } from 'next/navigation';

export interface TurmasPageData {
  turmas: TurmaAgendaItem[];
  employments: AcademiaEmployment[];
}

function toFailure(error: unknown, source: string): LoadFailure {
  unstable_rethrow(error);
  const status = error instanceof AppError ? error.statusCode : undefined;
  if (status === 401 || status === 403) return 'forbidden';
  console.error(`Turmas: ${source} failed.`, { status });
  return 'failed';
}

export function isLoadFailure<T>(
  result: T | LoadFailure
): result is LoadFailure {
  return typeof result === 'string';
}

export async function loadTurmas(): Promise<TurmasPageData | LoadFailure> {
  try {
    const [turmas, employments] = await Promise.all([
      apiClient<TurmaAgendaItem[]>('/academia/turmas', {
        method: 'GET',
        cache: 'no-store',
      }),
      apiClient<AcademiaEmployment[]>('/academia/educators', {
        method: 'GET',
        cache: 'no-store',
      }),
    ]);
    return { turmas, employments };
  } catch (error) {
    return toFailure(error, 'list');
  }
}
