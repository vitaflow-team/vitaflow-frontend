import { z } from 'zod';

// Same two consents, with the same wording, as the sign-up form.
export const customerActivationSchema = z.object({
  termsAccepted: z.boolean().refine(value => value === true, {
    message: 'É preciso aceitar os Termos de Uso e a Política de Privacidade.',
  }),
  healthDataConsent: z.boolean().refine(value => value === true, {
    message: 'É preciso autorizar o tratamento dos seus dados de saúde.',
  }),
});

export type CustomerActivationFormData = z.infer<
  typeof customerActivationSchema
>;
