import type { AssessmentFormData } from '@/_schema/assessment';
import type { CreateAssessmentOutcome } from '@/_types/createAssessmentOutcome';

export type SaveStep =
  | { kind: 'saved' }
  | { kind: 'failed'; message: string }
  /** The one-time declaration is needed before this save can go through. */
  | { kind: 'declaration' };

interface Failure {
  message: string;
}

export interface AssessmentRequests {
  replace: (
    assessmentId: string,
    values: AssessmentFormData
  ) => Promise<[unknown, Failure | null]>;
  add: (
    values: AssessmentFormData,
    acceptDeclaration: boolean
  ) => Promise<[CreateAssessmentOutcome | null, Failure | null]>;
}

interface PerformSaveInput {
  existing?: { id: string };
  declarationAccepted: boolean;
  values: AssessmentFormData;
  /** True when the educator just accepted the declaration for this save. */
  acceptNow: boolean;
  requests: AssessmentRequests;
}

/**
 * One save of the assessment form. An edit is a full replace. A new one
 * needs the declaration on record: when it is not (known, or told by the
 * backend), nothing is saved and the caller opens the declaration dialog; the
 * values stay with the caller, who sends them again once it is accepted.
 */
export async function performSave({
  existing,
  declarationAccepted,
  values,
  acceptNow,
  requests,
}: PerformSaveInput): Promise<SaveStep> {
  if (existing) {
    const [, failure] = await requests.replace(existing.id, values);
    return failure ? { kind: 'failed', message: failure.message } : SAVED;
  }
  if (!declarationAccepted && !acceptNow) return { kind: 'declaration' };

  const [result, failure] = await requests.add(values, acceptNow);
  if (failure) return { kind: 'failed', message: failure.message };

  return result?.outcome === 'declaration_required'
    ? { kind: 'declaration' }
    : SAVED;
}

const SAVED: SaveStep = { kind: 'saved' };

/** A second submit while one is in flight is dropped: one click, one request. */
export function shouldSubmit(isPending: boolean): boolean {
  return !isPending;
}
