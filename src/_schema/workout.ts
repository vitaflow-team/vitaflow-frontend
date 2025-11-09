import { z } from 'zod';

export const workoutSchema = z.object({
  id: z.string().optional(),
  description: z
    .string()
    .min(2, 'A descrição do treino é obrigatótia')
    .max(200, 'Descrição muito longa'),
  description2: z
    .string()
    .min(2, 'A descrição do treino é obrigatótia')
    .max(200, 'Descrição muito longa'),
});

export type workoutFormData = z.infer<typeof workoutSchema>;
