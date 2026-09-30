/**
 * Outcome of asking the backend whether the caller is Vita Flow staff.
 * `unavailable` means the backend could not answer, which is never access.
 */
export type BackofficeAccess = 'allowed' | 'denied' | 'unavailable';
