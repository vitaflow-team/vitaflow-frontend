import { z } from 'zod';

const streetNumberRegex = /^[0-9]+[A-Za-z0-9\-]*$/;
const zipRegex = /^\d{5}-?\d{3}$/;
const phoneRegex = /^\(?[1-9]{2}\)?\s?(?:9\d{4}|\d{4})-?\d{4}$/;

export const profileSchema = z.object({
  name: z.string().min(2, 'Campo obrigatório').max(100, 'Nome muito longo'),
  email: z.email('Inválido').toLowerCase(),
  phone: z
    .string()
    .trim()
    .regex(phoneRegex, 'Inválido')
    .min(10, 'Número muito curto')
    .max(20, 'Número muito longo'),
  address: z
    .object({
      streetName: z
        .string()
        .trim()
        .min(1, 'Campo obrigatório')
        .max(100, 'Nome da rua muito longo'),
      streetNumber: z
        .string()
        .trim()
        .min(1, 'Campo obrigatório')
        .regex(streetNumberRegex, 'Número inválido (ex: 1234, 123A, 12-3)'),
      zip: z.string().trim().regex(zipRegex, 'Inválido'),
      state: z.string().trim().toUpperCase().length(2, 'Inválido (sigla)'),
      city: z
        .string()
        .trim()
        .min(1, 'Campo obrigatório')
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
