import 'server-only';

import { apiClient } from '@/_lib/apiClient';
import { AppError } from '@/_lib/AppError';
import type { LoadFailure } from '@/_types/loadFailure';
import type {
  NutritionistPatient,
  NutritionistPatientList,
} from '@/_types/patients';
import { unstable_rethrow } from 'next/navigation';
import { cache } from 'react';
import { z } from 'zod';

const uuidSchema = z.uuid();

function toFailure(error: unknown, source: string): LoadFailure {
  unstable_rethrow(error);
  const status = error instanceof AppError ? error.statusCode : undefined;
  if (status === 401 || status === 403) return 'forbidden';
  if (status === 404) return 'not-found';
  console.error(`Patients: ${source} failed.`, { status });
  return 'failed';
}

export function isLoadFailure<T>(
  result: T | LoadFailure
): result is LoadFailure {
  return typeof result === 'string';
}

async function guarded<T>(
  source: string,
  load: () => Promise<T>
): Promise<T | LoadFailure> {
  try {
    return await load();
  } catch (error) {
    return toFailure(error, source);
  }
}

export async function loadPatients(
  search?: string
): Promise<NutritionistPatientList | LoadFailure> {
  const query = new URLSearchParams();
  if (search) query.set('search', search);
  const suffix = query.toString() ? `?${query.toString()}` : '';

  return await guarded('list', () =>
    apiClient<NutritionistPatientList>(`/nutritionist/patients${suffix}`, {
      method: 'GET',
      cache: 'no-store',
    })
  );
}

/**
 * One request per render: the layout (header) and the tab pages below it
 * ask for the same patient and share a single backend call.
 */
export const loadPatient = cache(
  async (id: string): Promise<NutritionistPatient | LoadFailure> => {
    if (!uuidSchema.safeParse(id).success) return 'not-found';

    return await guarded('record', () =>
      apiClient<NutritionistPatient>(`/nutritionist/patients/${id}`, {
        method: 'GET',
        cache: 'no-store',
      })
    );
  }
);
