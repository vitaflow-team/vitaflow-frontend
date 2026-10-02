import 'server-only';

import { apiClient } from '@/_lib/apiClient';
import { AppError } from '@/_lib/AppError';
import type { LoadFailure } from '@/_types/loadFailure';
import type {
  AvailabilityWindow,
  Slot,
  UpcomingSlot,
} from '@/_types/scheduling';
import { unstable_rethrow } from 'next/navigation';

function toFailure(error: unknown, source: string): LoadFailure {
  unstable_rethrow(error);
  const status = error instanceof AppError ? error.statusCode : undefined;
  if (status === 401 || status === 403) return 'forbidden';
  if (status === 404) return 'not-found';
  console.error(`Scheduling: ${source} failed.`, { status });
  return 'failed';
}

export function isLoadFailure<T>(
  result: T | LoadFailure
): result is LoadFailure {
  return typeof result === 'string';
}

export async function loadMyAvailability(): Promise<
  AvailabilityWindow[] | LoadFailure
> {
  try {
    return await apiClient<AvailabilityWindow[]>('/scheduling/availability', {
      method: 'GET',
      cache: 'no-store',
    });
  } catch (error) {
    return toFailure(error, 'availability');
  }
}

export async function loadOpenSlots(
  professionalId: string,
  from: Date,
  to: Date
): Promise<Slot[] | LoadFailure> {
  const query = new URLSearchParams({
    professionalId,
    from: from.toISOString(),
    to: to.toISOString(),
  });
  try {
    return await apiClient<Slot[]>(`/scheduling/slots?${query.toString()}`, {
      method: 'GET',
      cache: 'no-store',
    });
  } catch (error) {
    return toFailure(error, 'slots');
  }
}

export async function loadUpcoming(): Promise<UpcomingSlot[] | LoadFailure> {
  try {
    return await apiClient<UpcomingSlot[]>('/scheduling/upcoming', {
      method: 'GET',
      cache: 'no-store',
    });
  } catch (error) {
    return toFailure(error, 'upcoming');
  }
}
