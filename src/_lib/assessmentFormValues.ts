import { ASSESSMENT_FIELDS } from '@/_constants/assessmentFields';
import { formatAssessmentNumber } from '@/_lib/assessmentNumber';
import { todayInBrazil } from '@/_lib/studentsDates';
import type { AssessmentFormInput } from '@/_schema/assessment';
import type { Assessment } from '@/_types/students';

function emptyValues(): AssessmentFormInput {
  const values = { assessedOn: '' } as AssessmentFormInput;
  for (const { name } of ASSESSMENT_FIELDS) values[name] = '';

  return values;
}

interface DefaultsInput {
  /** The assessment being edited; its values are kept as saved. */
  existing?: Assessment;
  /** The newest saved assessment, whose height starts a new one. */
  previous?: Assessment | null;
  today?: string;
}

/**
 * A new assessment starts today, with the previous assessment's height (the
 * one value that rarely changes); an edit starts from what was saved.
 */
export function getAssessmentDefaults({
  existing,
  previous,
  today = todayInBrazil(),
}: DefaultsInput): AssessmentFormInput {
  const values = emptyValues();

  if (existing) {
    values.assessedOn = existing.assessedOn;
    for (const { name } of ASSESSMENT_FIELDS) {
      values[name] = formatAssessmentNumber(existing[name]);
    }
    return values;
  }

  values.assessedOn = today;
  values.heightCm = formatAssessmentNumber(previous?.heightCm);
  return values;
}

export type DiscardDecision = 'close' | 'confirm' | 'stay';

/**
 * What closing the form means: nothing typed closes at once, typed values ask
 * first, and a save in flight keeps the form open.
 */
export function decideClose(input: {
  isDirty: boolean;
  isPending: boolean;
}): DiscardDecision {
  if (input.isPending) return 'stay';

  return input.isDirty ? 'confirm' : 'close';
}
