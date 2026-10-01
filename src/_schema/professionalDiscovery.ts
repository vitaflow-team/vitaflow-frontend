import { z } from 'zod';

export const connectionRequestIdSchema = z.object({
  id: z.uuid(),
});

export const requestConnectionSchema = z.object({
  professionalId: z.uuid(),
});

function normalizePrice(value: unknown): number | undefined {
  if (value === undefined || value === null || value === '') return undefined;
  if (typeof value === 'number') return value;
  if (typeof value !== 'string') return Number.NaN;

  const trimmed = value.trim();
  if (trimmed === '') return undefined;
  if (!/^\d{1,7}([.,]\d{1,2})?$/.test(trimmed)) return Number.NaN;

  return Number(trimmed.replace(',', '.'));
}

export const updateProfileSchema = z.object({
  bio: z
    .string()
    .max(1000, 'A bio pode ter no máximo 1000 caracteres.')
    .optional(),
  specialty: z
    .string()
    .max(120, 'A especialidade pode ter no máximo 120 caracteres.')
    .optional(),
  priceFrom: z.preprocess(
    normalizePrice,
    z
      .number({ error: 'Informe um valor válido.' })
      .min(0, 'O valor não pode ser negativo.')
      .max(100_000, 'Informe um valor até R$ 100.000.')
      .optional()
  ),
  attendsOnline: z.boolean().optional(),
});

export type UpdateProfileFormData = z.infer<typeof updateProfileSchema>;
