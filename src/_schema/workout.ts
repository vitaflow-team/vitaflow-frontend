import { z } from 'zod';

export const workoutSchema = z
  .object({
    id: z.string().optional(),
    description: z
      .string()
      .min(2, 'Obrigatório')
      .max(200, 'Descrição muito longa'),
    startDate: z.date('Obrigatório'),
    endDate: z.date('Obrigatório'),
    daysOfWeek: z
      .array(z.enum(['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']))
      .min(1, 'Mínimo um dia da semana'),
    warmUp: z.string().optional(),
    restBetweenExercises: z
      .number()
      .min(0, 'Tempo de descanso inválido')
      .optional(),
    exercises: z
      .array(
        z.object({
          name: z.string().min(1, 'Obrigatório'),

          videoLink: z
            .url('Link do vídeo inválido')
            .optional()
            .or(z.literal('')),

          variations: z
            .array(
              z.object({
                weight: z.number().min(0, 'Peso inválido').optional(),
                reps: z.number().min(1, 'Número de repetições inválido'),
                restBetweenReps: z
                  .number()
                  .min(0, 'Tempo de descanso inválido')
                  .optional(),
              })
            )
            .min(1, 'Adicione pelo menos uma variação'),
        })
      )
      .min(1, 'Adicione pelo menos um exercício'),
  })
  .refine(data => data.endDate >= data.startDate, {
    message: 'Deve ser maior ou igual à inicial',
    path: ['endDate'],
  });

export type workoutFormData = z.infer<typeof workoutSchema>;
