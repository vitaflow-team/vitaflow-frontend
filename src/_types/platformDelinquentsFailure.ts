import type { LoadFailure } from './loadFailure';

/**
 * Why the delinquent list is not shown. `access-log-failed` is its own case:
 * the access could not be recorded, so nothing is returned (ADR-010).
 */
export type PlatformDelinquentsFailure = LoadFailure | 'access-log-failed';
