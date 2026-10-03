import type { Assessment } from '@/_types/students';

export type CreateAssessmentOutcome =
  | { outcome: 'saved'; assessment: Assessment }
  | { outcome: 'declaration_required' };
