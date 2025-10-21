import { z } from 'zod';

export const singUpSchema = z
  .object({
    name: z.string().min(2, 'Informe seu nome').max(100, 'Nome muito longo'),
    email: z.email('Informe um e-mail válido').toLowerCase(),
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

export type singUpFormData = z.infer<typeof singUpSchema>;
