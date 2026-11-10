import { z } from 'zod';

const coercedPositiveInt = z
  .union([z.string(), z.number()])
  .transform(value => Number(value))
  .pipe(
    z
      .number()
      .int('Use um número inteiro.')
      .positive('A quantidade de sessões deve ser maior que zero.')
  );

const coercedNonNegative = z
  .union([z.string(), z.number()])
  .transform(value => Number(value))
  .pipe(z.number().min(0, 'O valor de referência não pode ser negativo.'));

export const servicePackageSchema = z.object({
  name: z.string().trim().min(1, 'Informe um nome para o pacote.').max(120),
  sessionCount: coercedPositiveInt,
  referencePrice: coercedNonNegative,
});

export type ServicePackageFormInput = z.input<typeof servicePackageSchema>;
export type ServicePackageFormData = z.output<typeof servicePackageSchema>;
