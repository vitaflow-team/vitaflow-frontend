import { z } from 'zod';

export const contactSchema = z.object({
  name: z.string().min(2, 'Obrigatório').max(100, 'Nome muito longo'),
  email: z.email('Inválido').toLowerCase(),
  message: z.string().min(2, 'Obrigatória').max(800, 'Mensagem muito longo'),
  subject: z.string().min(2, 'Obrigatóio').max(100, 'Assunto muito longo'),
});

export type contactFormData = z.infer<typeof contactSchema>;
