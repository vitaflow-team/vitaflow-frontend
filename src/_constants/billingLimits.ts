// Mirrors vitaflow-backend's BILLING_LIMITS exactly — the backend is the
// authority, this is only for a faster, friendlier message before the round
// trip.
export const BILLING_LIMITS = {
  amountMinCents: 500,
  amountMaxCents: 5_000_000,
  dueDateMaxDaysAhead: 90,
  competenceMonthsWindow: 12,
  manualNoteMaxLength: 200,
  apiKeyMinLength: 10,
  apiKeyMaxLength: 200,
  resendIntervalMinutes: 60,
} as const;
