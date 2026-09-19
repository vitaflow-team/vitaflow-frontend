import { z } from 'zod';

function measurementNumber(label: string, minimum: number, maximum: number) {
  return z
    .number({ error: `${label} deve ser um número válido.` })
    .min(minimum, `${label} deve ser no mínimo ${minimum}.`)
    .max(maximum, `${label} deve ser no máximo ${maximum}.`)
    .multipleOf(0.1, `${label} deve ter no máximo uma casa decimal.`);
}

export const measurementRecordSchema = z.object({
  weightKg: measurementNumber('Peso', 20, 300),
  heightCm: measurementNumber('Altura', 50, 250),
  waistCm: measurementNumber('Cintura', 30, 200).optional(),
  hipCm: measurementNumber('Quadril', 30, 200).optional(),
});

export type measurementRecordFormData = z.infer<typeof measurementRecordSchema>;
