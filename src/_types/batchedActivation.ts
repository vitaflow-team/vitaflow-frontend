import type { ActivationResult } from './activationResult';

/** The merged outcome of an activation sent in batches. */
export interface BatchedActivation {
  result: ActivationResult;
  /** Why the run stopped early; `null` when every batch was answered. */
  failure: string | null;
  /** Students in the batches that were never sent. */
  notSent: number;
}
