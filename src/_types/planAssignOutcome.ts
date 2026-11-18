/** How linking a plan ended: saved, or why not (and whether the tax ID is what is missing). */
export type PlanAssignOutcome =
  | { done: true }
  | { done: false; message: string; needsTaxId: boolean };
