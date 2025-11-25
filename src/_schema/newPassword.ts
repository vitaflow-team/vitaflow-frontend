import { z } from 'zod';

export const newPasswordSchema = z
  .object({
    password: z
      .string()
      .min(8, 'Deve ter pelo menos 8 caracteres')
      .refine(value => /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/.test(value), {
        message: 'Deve ter letras maiúsculas, minúsculas e números',
      }),
    checkPassword: z
      .string()
      .min(8, 'Deve ter pelo menos 8 caracteres')
      .refine(value => /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/.test(value), {
        message: 'Deve ter letras maiúsculas, minúsculas e números',
      }),
  })
  .superRefine((data, ctx) => {
    if (data.password !== data.checkPassword) {
      ctx.addIssue({
        code: 'custom',
        path: ['checkPassword'],
        message: 'As senhas devem ser iguais',
      });
    }
  });

export type newPasswordFormData = z.infer<typeof newPasswordSchema>;
