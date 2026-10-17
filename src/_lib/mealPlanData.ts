import 'server-only';

import { apiClient } from '@/_lib/apiClient';
import { AppError } from '@/_lib/AppError';
import type { LoadFailure } from '@/_types/loadFailure';
import type { MealPlanDraft, MealPlanVersion } from '@/_types/mealPlan';
import { unstable_rethrow } from 'next/navigation';

function toFailure(error: unknown, source: string): LoadFailure {
  unstable_rethrow(error);
  const status = error instanceof AppError ? error.statusCode : undefined;
  if (status === 401 || status === 403) return 'forbidden';
  if (status === 404) return 'not-found';
  console.error(`MealPlan: ${source} failed.`, { status });
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

const BASE = (clientId: string) =>
  `/professionals/clients/${clientId}/meal-plan`;

export async function loadDraft(
  clientId: string
): Promise<MealPlanDraft | LoadFailure> {
  return await guarded('draft', () =>
    apiClient<MealPlanDraft>(`${BASE(clientId)}/draft`, {
      method: 'GET',
      cache: 'no-store',
    })
  );
}

export async function loadVersions(
  clientId: string
): Promise<MealPlanVersion[] | LoadFailure> {
  return await guarded('versions', () =>
    apiClient<MealPlanVersion[]>(`${BASE(clientId)}/versions`, {
      method: 'GET',
      cache: 'no-store',
    })
  );
}

export async function loadVersion(
  clientId: string,
  version: number
): Promise<MealPlanDraft | LoadFailure> {
  return await guarded('version', () =>
    apiClient<MealPlanDraft>(`${BASE(clientId)}/versions/${version}`, {
      method: 'GET',
      cache: 'no-store',
    })
  );
}
