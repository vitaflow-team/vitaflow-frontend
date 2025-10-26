import { z } from 'zod';

export const resetPasswordSchema = z.object({
  email: z.string().email('Provide a valid e-mail').toLowerCase(),
});

export type resetPasswordFormDate = z.infer<typeof resetPasswordSchema>;
