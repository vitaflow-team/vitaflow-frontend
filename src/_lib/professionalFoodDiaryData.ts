import 'server-only';

import { apiClient } from '@/_lib/apiClient';
import { AppError } from '@/_lib/AppError';
import type { LoadFailure } from '@/_types/loadFailure';
import type { ProfessionalFoodDiary } from '@/_types/professionalFoodDiary';
import { unstable_rethrow } from 'next/navigation';

function toFailure(error: unknown, source: string): LoadFailure {
  unstable_rethrow(error);
  const status = error instanceof AppError ? error.statusCode : undefined;
  if (status === 401 || status === 403) return 'forbidden';
  if (status === 404) return 'not-found';
  console.error(`ProfessionalFoodDiary: ${source} failed.`, { status });
  return 'failed';
}

export function isLoadFailure<T>(
  result: T | LoadFailure
): result is LoadFailure {
  return typeof result === 'string';
}

export async function loadFoodDiary(
  clientId: string
): Promise<ProfessionalFoodDiary | LoadFailure> {
  try {
    return await apiClient<ProfessionalFoodDiary>(
      `/professionals/clients/${clientId}/food-diary`,
      { method: 'GET', cache: 'no-store' }
    );
  } catch (error) {
    return toFailure(error, 'diary');
  }
}
