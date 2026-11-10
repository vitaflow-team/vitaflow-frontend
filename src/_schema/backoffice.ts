import { z } from 'zod';

export const startViewAsSchema = z.object({
  targetKind: z.enum(['USER', 'ACADEMIA_STAFF']),
  targetId: z.string().min(1),
  targetLabel: z.string().trim().min(1).max(200),
  reason: z.string().trim().min(1, 'Informe o motivo do acesso.').max(500),
});

export const endViewAsSchema = z.object({
  sessionId: z.string().min(1),
});

export const inviteStaffSchema = z.object({
  email: z.email('Informe um e-mail válido.').toLowerCase(),
  tier: z.enum(['EQUIPE', 'ADMIN']),
});

export const changeStaffTierSchema = z.object({
  staffId: z.string().min(1),
  tier: z.enum(['EQUIPE', 'ADMIN']),
});

export const removeStaffSchema = z.object({
  staffId: z.string().min(1),
});

// Coerced from the `<input type="number">` string a form submits, same
// pattern as `accessPlanSchema`'s own price field (`_schema/academia.ts`).
const coercedPositivePrice = z
  .union([z.string(), z.number()])
  .transform(value => Number(value))
  .pipe(z.number().positive('O preço deve ser maior que zero.'));

export const createProductSchema = z.object({
  groupId: z.string().min(1, 'Selecione um grupo de produto.'),
  name: z.string().trim().min(1, 'Informe um nome para o produto.').max(120),
  price: coercedPositivePrice,
  type: z.enum(['USER', 'NUTRITIONIST', 'PHYSICAL_EDUCATOR', 'ACADEMIA']),
  tier: z.enum(['FREE', 'STANDARD', 'PREMIUM']),
});

export const repriceProductSchema = z.object({
  productId: z.string().min(1),
  price: coercedPositivePrice,
});

export const deactivateProductSchema = z.object({
  productId: z.string().min(1),
});
