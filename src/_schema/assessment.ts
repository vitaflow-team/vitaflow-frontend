import {
  ASSESSMENT_FIELDS,
  type AssessmentFieldDef,
  type AssessmentFieldName,
} from '@/_constants/assessmentFields';
import { parseAssessmentNumber } from '@/_lib/assessmentNumber';
import { todayInBrazil } from '@/_lib/studentsDates';
import { z } from 'zod';

const ISO_DAY = /^\d{4}-\d{2}-\d{2}$/;

function isRealDay(value: string): boolean {
  const date = new Date(`${value}T00:00:00.000Z`);

  return (
    !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value
  );
}

function rangeMessage({ label, min, max, unit }: AssessmentFieldDef): string {
  return `${label} deve estar entre ${min} e ${max} ${unit}.`;
}

function numberFor(def: AssessmentFieldDef) {
  const base = z
    .number({
      error: issue =>
        issue.input === undefined
          ? `${def.label} é ${def.feminine ? 'obrigatória' : 'obrigatório'}.`
          : `${def.label} deve ser um número válido.`,
    })
    .min(def.min, rangeMessage(def))
    .max(def.max, rangeMessage(def));
  const precise = def.integer
    ? base.int(`${def.label} deve ser um número inteiro.`)
    : base.multipleOf(0.1, `${def.label} deve ter no máximo uma casa decimal.`);

  return z.preprocess(
    parseAssessmentNumber,
    def.required ? precise : precise.optional()
  );
}

const assessedOn = z
  .string()
  .trim()
  .min(1, 'A data é obrigatória.')
  .refine(value => ISO_DAY.test(value) && isRealDay(value), 'Data inválida.')
  .refine(
    value => !ISO_DAY.test(value) || value <= todayInBrazil(),
    'A data não pode ser futura.'
  );

const numberShape = Object.fromEntries(
  ASSESSMENT_FIELDS.map(def => [def.name, numberFor(def)])
) as Record<AssessmentFieldName, ReturnType<typeof numberFor>>;

export const assessmentSchema = z.object({ assessedOn, ...numberShape });

/** What the form holds while typing: every value is text. */
export type AssessmentFormInput = { assessedOn: string } & Record<
  AssessmentFieldName,
  string
>;

/** What the server action receives: parsed numbers, absent when left empty. */
export type AssessmentFormData = {
  assessedOn: string;
} & { [K in AssessmentFieldName]?: number } & {
  weightKg: number;
  heightCm: number;
};
