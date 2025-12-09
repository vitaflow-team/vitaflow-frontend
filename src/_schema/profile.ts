import { z } from 'zod';

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
  birthDate: z
    .string()
    .trim()
    .refine(
      value => {
        const date = new Date(value);
        return !isNaN(date.getTime());
      },
      { message: 'Data inválida' }
    )
    .refine(
      value => {
        const date = new Date(value);
        const maxDate = new Date();
        maxDate.setHours(0, 0, 0, 0);
        maxDate.setDate(maxDate.getDate() - 1);

        return date <= maxDate;
      },
      {
        message: 'Data inválida',
      }
    ),
  avatar: z
    .any()
    .refine(file => file instanceof File, 'Selecione uma imagem.')
    .refine(
      file => ['image/jpeg', 'image/png', 'image/webp'].includes(file.type),
      'O arquivo deve ser uma imagem JPG, PNG ou WEBP.'
    )
    .refine(file => file.size <= 2 * 1024 * 1024, 'Máximo 2MB.'),
  address: z
    .object({
      addressLine1: z
        .string()
        .trim()
        .min(1, 'Campo obrigatório')
        .max(100, 'Nome da rua muito longo'),
      addressLine2: z.string().trim(),
      district: z.string().trim().min(4, 'Campo obrigatório'),
      postalCode: z.string().trim().regex(zipRegex, 'Inválido'),
      region: z.string().trim().toUpperCase().length(2, 'Inválido (sigla)'),
      city: z
        .string()
        .trim()
        .min(1, 'Campo obrigatório')
        .max(100, 'Nome da cidade muito longo'),
    })
    .transform(obj => ({
      addressLine1: obj.addressLine1.trim(),
      addressLine2: obj.addressLine2.trim(),
      district: obj.district.trim(),
      city: obj.city.trim(),
      region: obj.region.toUpperCase(),
      postalCode: obj.postalCode.trim(),
    })),
});

export type profileFormData = z.infer<typeof profileSchema>;
