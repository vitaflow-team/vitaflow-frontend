import { MUSCLE_GROUPS } from '@/_constants/exerciseCatalog';
import { z } from 'zod';

// Named apart from `exercise.tsx`, which belongs to the unfinished workout
// form (sets, reps and rest), not to the shared catalog.

const EQUIPMENT_VALUES = ['GYM', 'HOME_BASIC', 'BODYWEIGHT'] as const;

const CONTRAINDICATION_VALUES = [
  'SHOULDER',
  'KNEE',
  'SPINE',
  'WRIST',
  'HIP',
  'ANKLE',
  'CARDIAC',
] as const;

function optionalWebLink(message: string) {
  return z.union([
    z.literal(''),
    z.url({ protocol: /^https?$/, error: message }).max(2000, message),
  ]);
}

/** Fields of an exercise, shared by the educator and backoffice forms. */
export const exerciseCatalogSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'O nome do exercício é obrigatório.')
    .max(120, 'Use no máximo 120 caracteres.'),
  description: z
    .string()
    .trim()
    .min(1, 'A descrição do exercício é obrigatória.')
    .max(5000, 'Use no máximo 5000 caracteres.'),
  muscleGroup: z.enum(MUSCLE_GROUPS, { error: 'Escolha o grupo muscular.' }),
  equipment: z.enum(EQUIPMENT_VALUES, { error: 'Escolha o equipamento.' }),
  contraindications: z.array(z.enum(CONTRAINDICATION_VALUES)),
  difficulty: z.string().trim().max(40, 'Use no máximo 40 caracteres.'),
  imageUrl: optionalWebLink('Informe um link de imagem válido.'),
  videoUrl: optionalWebLink('Informe um link de vídeo válido.'),
});

export const exerciseUpdateSchema = exerciseCatalogSchema.extend({
  id: z.string().min(1),
});

export const exerciseIdSchema = z.object({ id: z.string().min(1) });

export const exerciseRejectSchema = z.object({
  id: z.string().min(1),
  reason: z.string().trim().max(500, 'Use no máximo 500 caracteres.'),
});

export type ExerciseCatalogFormData = z.output<typeof exerciseCatalogSchema>;

/** What the form fields hold before validation: selects start empty. */
export interface ExerciseCatalogFormInput {
  name: string;
  description: string;
  muscleGroup: string;
  equipment: string;
  contraindications: string[];
  difficulty: string;
  imageUrl: string;
  videoUrl: string;
}
