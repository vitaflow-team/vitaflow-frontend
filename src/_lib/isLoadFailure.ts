import type { LoadFailure } from '@/_types/loadFailure';

/** Tells a failed server load apart from the data it would have returned. */
export function isLoadFailure<T>(
  result: T | LoadFailure
): result is LoadFailure {
  return typeof result === 'string';
}
