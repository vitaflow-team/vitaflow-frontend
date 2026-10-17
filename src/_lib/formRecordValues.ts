import type { FormRecord, TemplateField } from '@/_types/clinicalRecords';

export type FieldAnswer = string | number | boolean;
export type AnswersByFieldId = Record<string, FieldAnswer | undefined>;

/** The API's own value-input shape, one entry per answered field. */
export function buildValueInputs(
  fields: TemplateField[],
  answers: AnswersByFieldId
): Array<{ templateFieldId: string; value: FieldAnswer }> {
  const inputs: Array<{ templateFieldId: string; value: FieldAnswer }> = [];
  for (const field of fields) {
    const value = answers[field.id];
    if (isAnswered(value)) inputs.push({ templateFieldId: field.id, value });
  }
  return inputs;
}

function isAnswered(value: FieldAnswer | undefined): value is FieldAnswer {
  return value !== undefined && value !== '';
}

/**
 * Starting values for editing an existing record: matched by field label,
 * since a `FormRecord`'s own read view never carries the field id it was
 * answered against (ADR-010's frozen snapshot has no back-reference) —
 * the closest faithful match available against the current template.
 */
export function prefillAnswers(
  fields: TemplateField[],
  existing: FormRecord | null
): AnswersByFieldId {
  if (!existing) return {};

  const byLabel = new Map(
    existing.values.map(value => [value.fieldLabel, value.value])
  );
  const answers: AnswersByFieldId = {};
  for (const field of fields) {
    const value = byLabel.get(field.label);
    if (value !== null && value !== undefined) answers[field.id] = value;
  }
  return answers;
}

/** The label of the first required-but-unanswered field, or null. */
export function missingRequiredField(
  fields: TemplateField[],
  answers: AnswersByFieldId
): string | null {
  const missing = fields.find(
    field => field.required && !isAnswered(answers[field.id])
  );
  return missing?.label ?? null;
}
