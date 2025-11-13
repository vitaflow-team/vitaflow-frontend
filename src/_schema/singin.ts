import { z } from 'zod';

export const singInSchema = z.object({
  email: z.email('Informe um e-mail válido').toLowerCase(),
  password: z.string().min(2, 'Deve ter pelo menos 2 caracteres'),
});

export type singInFormDate = z.infer<typeof singInSchema>;
