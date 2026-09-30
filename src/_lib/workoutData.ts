import 'server-only';

import { apiClient } from '@/_lib/apiClient';
import { AppError } from '@/_lib/AppError';
import type { LoadFailure } from '@/_types/loadFailure';
import type { Workout } from '@/_types/workout';
import { unstable_rethrow } from 'next/navigation';

function toFailure(error: unknown): LoadFailure {
  unstable_rethrow(error);
  const status = error instanceof AppError ? error.statusCode : undefined;
  if (status === 401 || status === 403) return 'forbidden';
  console.error('Workout: current load failed.', { status });
  return 'failed';
}

/** The user's current AI-generated workout, or `null` if none was
 * generated yet — not a load failure. The backend wraps the possibly-null
 * result in `{ workout }` (a bare `null` body cannot round-trip through a
 * JSON-parsing HTTP client). */
export async function loadCurrentWorkout(): Promise<
  Workout | null | LoadFailure
> {
  try {
    const result = await apiClient<{ workout: Workout | null }>(
      '/workouts/current',
      { method: 'GET', cache: 'no-store' }
    );
    return result.workout;
  } catch (error) {
    return toFailure(error);
  }
}

export function isLoadFailure<T>(
  result: T | LoadFailure
): result is LoadFailure {
  return typeof result === 'string';
}
