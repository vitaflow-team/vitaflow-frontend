import 'server-only';

import { apiClient } from '@/_lib/apiClient';
import { AppError } from '@/_lib/AppError';
import { toBackendQuery } from '@/_lib/exerciseFilter';
import type { Exercise } from '@/_types/exercise';
import type { ExerciseFilter } from '@/_types/exerciseFilter';
import type { LoadFailure } from '@/_types/loadFailure';
import { unstable_rethrow } from 'next/navigation';
import { z } from 'zod';

// Nothing here is cached: `GET /exercises/:id` answers staff with unapproved
// entries too, so a shared cache could leak a pending submission to a user
// (frontend-next.md §5).

function toFailure(error: unknown, source: string): LoadFailure {
  // Next's own control-flow errors (dynamic rendering bailout) must reach Next.
  unstable_rethrow(error);
  const status = error instanceof AppError ? error.statusCode : undefined;
  if (status === 401 || status === 403) return 'forbidden';
  if (status === 404) return 'not-found';
  console.error(`Exercise catalog: ${source} failed.`, { status });
  return 'failed';
}

async function load<T>(path: string, source: string): Promise<T | LoadFailure> {
  try {
    return await apiClient<T>(path, { method: 'GET', cache: 'no-store' });
  } catch (error) {
    return toFailure(error, source);
  }
}

/** The approved catalog page matching every active filter at once. */
export function loadExercises(filter: ExerciseFilter) {
  return load<Exercise[]>(`/exercises${toBackendQuery(filter)}`, 'list');
}

/** One exercise; an id that is not a UUID never reaches the backend. */
export function loadExercise(id: string) {
  if (!z.uuid().safeParse(id).success) {
    return Promise.resolve<LoadFailure>('not-found');
  }
  return load<Exercise>(`/exercises/${encodeURIComponent(id)}`, 'detail');
}

/** The educator's own submissions; `forbidden` for any other account. */
export function loadOwnSubmissions() {
  return load<Exercise[]>('/exercises/submissions/mine', 'submissions');
}

/** The moderation queue; `forbidden` for anyone who is not staff. */
export function loadPendingQueue() {
  return load<Exercise[]>('/admin/exercises/pending', 'pending queue');
}

export function isLoadFailure<T>(
  result: T | LoadFailure
): result is LoadFailure {
  return typeof result === 'string';
}
