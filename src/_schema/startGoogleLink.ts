import { z } from 'zod';

// The password is asked only from an account with staff access, and it is
// the account's existing one — so only its presence and length are checked.
export const startGoogleLinkSchema = z.object({
  password: z.string().min(1, 'Informe sua senha.').max(72).optional(),
});

export const confirmPasswordSchema = z.object({
  password: z.string().min(1, 'Informe sua senha.').max(72),
});

export type ConfirmPasswordFormData = z.infer<typeof confirmPasswordSchema>;
