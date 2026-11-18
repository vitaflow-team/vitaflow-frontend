import type { ActivationSkip } from './activationSkip';

/** `POST .../billing/activate`: who was activated and who was skipped, with the reason. */
export interface ActivationResult {
  activated: string[];
  skipped: ActivationSkip[];
}
