import { z } from 'zod';

export const signInSchema = z.object({
  email: z.email('Informe um e-mail válido').toLowerCase(),
  password: z.string().min(2, 'Deve ter pelo menos 2 caracteres'),
});

export type signInFormDate = z.infer<typeof signInSchema>;
