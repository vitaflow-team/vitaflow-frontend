import 'server-only';

import { apiClient } from '@/_lib/apiClient';
import { AppError } from '@/_lib/AppError';
import type { LoadFailure } from '@/_types/loadFailure';
import type {
  EducatorMirror,
  NoProfessionalMirror,
  NutritionistMirror,
} from '@/_types/professionalMirror';
import { unstable_rethrow } from 'next/navigation';

function toFailure(error: unknown, source: string): LoadFailure {
  unstable_rethrow(error);
  const status = error instanceof AppError ? error.statusCode : undefined;
  if (status === 401 || status === 403) return 'forbidden';
  console.error(`Professional mirror: ${source} failed.`, { status });
  return 'failed';
}

export async function loadNutritionistMirror(): Promise<
  NutritionistMirror | NoProfessionalMirror | LoadFailure
> {
  try {
    return await apiClient<NutritionistMirror | NoProfessionalMirror>(
      '/me/nutritionist',
      { method: 'GET', cache: 'no-store' }
    );
  } catch (error) {
    return toFailure(error, 'nutritionist');
  }
}

export async function loadEducatorMirror(): Promise<
  EducatorMirror | NoProfessionalMirror | LoadFailure
> {
  try {
    return await apiClient<EducatorMirror | NoProfessionalMirror>(
      '/me/physical-educator',
      { method: 'GET', cache: 'no-store' }
    );
  } catch (error) {
    return toFailure(error, 'physical-educator');
  }
}

export function isLoadFailure<T>(
  result: T | LoadFailure
): result is LoadFailure {
  return typeof result === 'string';
}

export function hasLinkedProfessional<T extends { professional: unknown }>(
  result: T | NoProfessionalMirror
): result is T {
  return 'professional' in result;
}
