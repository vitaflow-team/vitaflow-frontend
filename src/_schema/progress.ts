import { z } from 'zod';
import { normalizeDecimalInput } from '@/_lib/decimalInput';

function measurementNumber(label: string, minimum: number, maximum: number) {
  return z
    .number({ error: `${label} deve ser um número válido.` })
    .min(minimum, `${label} deve ser no mínimo ${minimum}.`)
    .max(maximum, `${label} deve ser no máximo ${maximum}.`)
    .multipleOf(0.1, `${label} deve ter no máximo uma casa decimal.`);
}

export const measurementRecordSchema = z.object({
  weightKg: z.preprocess(
    normalizeDecimalInput,
    measurementNumber('Peso', 20, 300)
  ),
  heightCm: z.preprocess(
    normalizeDecimalInput,
    measurementNumber('Altura', 50, 250)
  ),
  waistCm: z.preprocess(
    normalizeDecimalInput,
    measurementNumber('Cintura', 30, 200).optional()
  ),
  hipCm: z.preprocess(
    normalizeDecimalInput,
    measurementNumber('Quadril', 30, 200).optional()
  ),
});

export interface MeasurementRecordFormInput {
  weightKg: string;
  heightCm: string;
  waistCm: string;
  hipCm: string;
}

export type MeasurementRecordFormData = z.output<
  typeof measurementRecordSchema
>;

/** @deprecated Prefer the PascalCase output type. */
export type measurementRecordFormData = MeasurementRecordFormData;
