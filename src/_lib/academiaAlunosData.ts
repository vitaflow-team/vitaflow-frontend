import 'server-only';

import { apiClient } from '@/_lib/apiClient';
import { AppError } from '@/_lib/AppError';
import { loadBillingAccount } from '@/_lib/billingData';
import { gymBillingAvailability } from '@/_lib/gymBillingAvailability';
import type { AcademiaEmployment } from '@/_types/academia';
import type { AcademiaAlunosList } from '@/_types/academiaAlunos';
import type { GymBillingAvailability } from '@/_types/gymBillingAvailability';
import type { LoadFailure } from '@/_types/loadFailure';
import { unstable_rethrow } from 'next/navigation';
import type { AcademiaAlunosParams } from './academiaAlunosList';

export interface AcademiaAlunosPageData {
  list: AcademiaAlunosList;
  employments: AcademiaEmployment[];
  /** Whether the gym can start charging monthly fees; never blocks the list. */
  billing: GymBillingAvailability;
}

function toFailure(error: unknown, source: string): LoadFailure {
  unstable_rethrow(error);
  const status = error instanceof AppError ? error.statusCode : undefined;
  if (status === 401 || status === 403) return 'forbidden';
  console.error(`Academia alunos: ${source} failed.`, { status });
  return 'failed';
}

export function isLoadFailure<T>(
  result: T | LoadFailure
): result is LoadFailure {
  return typeof result === 'string';
}

export async function loadAcademiaAlunos({
  search,
  horario,
  page,
}: AcademiaAlunosParams): Promise<AcademiaAlunosPageData | LoadFailure> {
  const query = new URLSearchParams({ page: String(page) });
  if (search) query.set('search', search);
  if (horario) query.set('horario', horario);

  try {
    const [list, employments, account] = await Promise.all([
      apiClient<AcademiaAlunosList>(`/academia/students?${query.toString()}`, {
        method: 'GET',
        cache: 'no-store',
      }),
      apiClient<AcademiaEmployment[]>('/academia/educators', {
        method: 'GET',
        cache: 'no-store',
      }),
      loadBillingAccount(),
    ]);
    return {
      list,
      employments,
      billing: gymBillingAvailability(account),
    };
  } catch (error) {
    return toFailure(error, 'list');
  }
}
