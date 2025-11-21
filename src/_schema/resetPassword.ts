import { z } from 'zod';

export const resetPasswordSchema = z.object({
  email: z.email('Informe um e-mail válido.').toLowerCase(),
});

export type resetPasswordFormDate = z.infer<typeof resetPasswordSchema>;
