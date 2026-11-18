/** Mirrors the backend's recurring billing limits; the backend stays the authority. */
export const GYM_BILLING_LIMITS = {
  dueDayMin: 1,
  dueDayMax: 28,
  /** Students per activation request; larger selections are sent in batches. */
  bulkActivationMaxItems: 200,
} as const;
