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
