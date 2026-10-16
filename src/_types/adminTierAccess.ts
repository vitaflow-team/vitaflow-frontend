/**
 * Outcome of asking the backend whether the caller is an admin interno.
 * `unavailable` means the backend could not answer, which is never access.
 */
export type AdminTierAccess = 'allowed' | 'denied' | 'unavailable';
