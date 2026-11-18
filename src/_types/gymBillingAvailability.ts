/**
 * Whether the gym can start charging monthly fees now: `READY`, or what is in
 * the way (no connected account, a key to reconnect, no paid subscription).
 */
export type GymBillingAvailability =
  | 'READY'
  | 'NOT_CONNECTED'
  | 'RECONNECT_NEEDED'
  | 'SUBSCRIPTION_REQUIRED';
