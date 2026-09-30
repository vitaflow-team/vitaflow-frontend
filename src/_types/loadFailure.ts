/**
 * Why a server-side load returned no data: the backend refused the caller
 * (`forbidden`), has no such record (`not-found`), or could not answer.
 */
export type LoadFailure = 'forbidden' | 'not-found' | 'failed';
