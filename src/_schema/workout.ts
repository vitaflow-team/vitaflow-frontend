import { z } from 'zod';

export const workoutSchema = z
  .object({
    id: z.string().optional(),
    description: z
      .string()
      .min(2, 'A descrição do treino é obrigatótia')
      .max(200, 'Descrição muito longa'),
    startDate: z.date('A data inicial é obrigatória'),
    endDate: z.date('A data final é obrigatória'),
    daysOfWeek: z
      .array(
        z.enum([
          'Segunda-feira',
          'Terça-feira',
          'Quarta-feira',
          'Quinta-feira',
          'Sexta-feira',
          'Sábado',
          'Domingo',
        ])
      )
      .min(1, 'Selecione pelo menos um dia da semana'),
    warmUp: z.string().optional(),
    exercises: z
      .array(
        z.object({
          name: z.string().min(1, 'O nome do exercício é obrigatório'),

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
                restBetweenExercises: z
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
    message: 'A data final deve ser maior ou igual à data inicial',
    path: ['endDate'],
  });

export type workoutFormData = z.infer<typeof workoutSchema>;
