import type { PlatformDelinquentsFailure } from '@/_types/platformDelinquentsFailure';

/** Tells a failed platform read apart from the data it would have returned. */
export function isPlatformFailure(
  result: unknown
): result is PlatformDelinquentsFailure {
  return typeof result === 'string';
}
