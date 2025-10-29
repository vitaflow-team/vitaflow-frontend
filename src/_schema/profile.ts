import { z } from 'zod';

const streetNumberRegex = /^[0-9]+[A-Za-z0-9\-]*$/;
const zipRegex = /^\d{5}(?:-\d{4})?$/;
const phoneRegex = /^(\+1\s?)?(\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4})$/;

export const profileSchema = z.object({
  name: z.string().min(2, 'Informe seu nome').max(100, 'Nome muito longo'),
  email: z.email('Informe um e-mail válido').toLowerCase(),
  phone: z
    .string()
    .trim()
    .regex(phoneRegex, 'Celular inválido (ex: +1 123-456-7890)')
    .min(10, 'Número muito curto')
    .max(20, 'Número muito longo'),
  address: z
    .object({
      streetName: z
        .string()
        .trim()
        .min(1, 'A rua é obrigatório')
        .max(100, 'Nome da rua muito longo'),
      streetNumber: z
        .string()
        .trim()
        .min(1, 'Número da rua é obrigatório')
        .regex(streetNumberRegex, 'Número inválido (ex: 1234, 123A, 12-3)'),
      zip: z
        .string()
        .trim()
        .regex(zipRegex, 'CEP inválido (use 12345 ou 12345-6789)'),
      state: z
        .string()
        .trim()
        .toUpperCase()
        .length(2, 'Estado deve ter 2 caracteres (sigla)'),
      city: z
        .string()
        .trim()
        .min(1, 'Cidade é obrigatória')
        .max(100, 'Nome da cidade muito longo'),
    })
    .transform(obj => ({
      streetNumber: obj.streetNumber.trim(),
      streetName: obj.streetName.trim(),
      city: obj.city.trim(),
      state: obj.state.toUpperCase(),
      zip: obj.zip.trim(),
    })),
});

export type profileFormData = z.infer<typeof profileSchema>;
