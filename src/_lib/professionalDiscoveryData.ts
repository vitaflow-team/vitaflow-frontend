import 'server-only';

import { apiClient } from '@/_lib/apiClient';
import { AppError } from '@/_lib/AppError';
import { toBackendQuery } from '@/_lib/professionalFilter';
import type { LoadFailure } from '@/_types/loadFailure';
import type {
  ConnectionRequest,
  ProfessionalProfile,
  ProfessionalSummary,
} from '@/_types/professionalDiscovery';
import type { ProfessionalFilter } from '@/_types/professionalFilter';
import { unstable_rethrow } from 'next/navigation';

function toFailure(error: unknown, source: string): LoadFailure {
  unstable_rethrow(error);
  const status = error instanceof AppError ? error.statusCode : undefined;
  if (status === 404) return 'not-found';
  if (status === 401 || status === 403) return 'forbidden';
  console.error(`Professional discovery: ${source} failed.`, { status });
  return 'failed';
}

export async function loadProfessionals(
  filter: ProfessionalFilter
): Promise<ProfessionalSummary[] | LoadFailure> {
  try {
    return await apiClient<ProfessionalSummary[]>(
      `/professionals${toBackendQuery(filter)}`,
      { method: 'GET', cache: 'no-store' }
    );
  } catch (error) {
    return toFailure(error, 'search');
  }
}

export async function loadProfessionalProfile(
  id: string
): Promise<ProfessionalProfile | LoadFailure> {
  try {
    return await apiClient<ProfessionalProfile>(
      `/professionals/${encodeURIComponent(id)}`,
      { method: 'GET', cache: 'no-store' }
    );
  } catch (error) {
    return toFailure(error, 'profile');
  }
}

export async function loadMyRequests(): Promise<
  ConnectionRequest[] | LoadFailure
> {
  try {
    return await apiClient<ConnectionRequest[]>('/connection-requests/mine', {
      method: 'GET',
      cache: 'no-store',
    });
  } catch (error) {
    return toFailure(error, 'mine');
  }
}

export async function loadIncomingRequests(): Promise<
  ConnectionRequest[] | LoadFailure
> {
  try {
    return await apiClient<ConnectionRequest[]>(
      '/connection-requests/incoming',
      { method: 'GET', cache: 'no-store' }
    );
  } catch (error) {
    return toFailure(error, 'incoming');
  }
}

export function isLoadFailure<T>(
  result: T | LoadFailure
): result is LoadFailure {
  return typeof result === 'string';
}
