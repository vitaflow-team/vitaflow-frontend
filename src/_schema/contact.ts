import { z } from 'zod';

export const contactSchema = z.object({
  name: z.string().min(2, 'Informe seu nome').max(100, 'Nome muito longo'),
  email: z.email('Informe um e-mail válido').toLowerCase(),
  message: z
    .string()
    .min(2, 'Informe a mensagem')
    .max(800, 'Mensagem muito longo'),
  subject: z
    .string()
    .min(2, 'Informe o assunto')
    .max(100, 'Assunto muito longo'),
});

export type contactFormData = z.infer<typeof contactSchema>;
