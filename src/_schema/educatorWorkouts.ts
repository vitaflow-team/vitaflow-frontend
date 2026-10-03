import { MUSCLE_GROUPS } from '@/_constants/exerciseCatalog';
import {
  EXERCISE_LOAD_MAX,
  EXERCISE_REPS_MAX,
  EXERCISE_SETS_MAX,
  EXERCISE_SETS_MIN,
  FREE_EXERCISE_NAME_MAX,
  SESSION_EXERCISES_MAX,
  SESSION_NAME_MAX,
  VIDEO_URL_MAX,
  WORKOUT_FREQUENCY_MAX,
  WORKOUT_FREQUENCY_MIN,
  WORKOUT_SESSIONS_MAX,
  WORKOUT_TITLE_MAX,
} from '@/_constants/educatorWorkoutLimits';
import { z } from 'zod';

const WHOLE_NUMBER = /^\d+$/;

/** Blank text means "not provided". */
function blankToUndefined(value: unknown): unknown {
  return typeof value === 'string' && value.trim() === '' ? undefined : value;
}

/** A whole number typed as text; anything else is `NaN`, never coerced. */
function wholeNumber(value: unknown): unknown {
  if (typeof value === 'number') return value;
  if (typeof value !== 'string') return value;

  const trimmed = value.trim();
  if (trimmed === '') return undefined;
  return WHOLE_NUMBER.test(trimmed) && trimmed.length <= 3
    ? Number(trimmed)
    : Number.NaN;
}

function isHttpUrl(value: string): boolean {
  if (/\s/.test(value)) return false;
  try {
    const { protocol } = new URL(value);
    return protocol === 'http:' || protocol === 'https:';
  } catch {
    return false;
  }
}

export const workoutTitleSchema = z
  .string()
  .trim()
  .min(1, 'O título é obrigatório.')
  .max(
    WORKOUT_TITLE_MAX,
    `O título deve ter no máximo ${WORKOUT_TITLE_MAX} caracteres.`
  );

export const weeklyFrequencySchema = z.preprocess(
  wholeNumber,
  z
    .number({
      error: `A frequência deve ser um número inteiro de ${WORKOUT_FREQUENCY_MIN} a ${WORKOUT_FREQUENCY_MAX}.`,
    })
    .int(
      `A frequência deve ser um número inteiro de ${WORKOUT_FREQUENCY_MIN} a ${WORKOUT_FREQUENCY_MAX}.`
    )
    .min(
      WORKOUT_FREQUENCY_MIN,
      `A frequência deve ser de ${WORKOUT_FREQUENCY_MIN} a ${WORKOUT_FREQUENCY_MAX} dias.`
    )
    .max(
      WORKOUT_FREQUENCY_MAX,
      `A frequência deve ser de ${WORKOUT_FREQUENCY_MIN} a ${WORKOUT_FREQUENCY_MAX} dias.`
    )
    .optional()
);

export const sessionNameSchema = z
  .string()
  .trim()
  .min(1, 'O nome da sessão é obrigatório.')
  .max(
    SESSION_NAME_MAX,
    `O nome da sessão deve ter no máximo ${SESSION_NAME_MAX} caracteres.`
  );

/** An optional external link: http or https only, no spaces, at most 500 characters. */
export const videoUrlSchema = z.preprocess(
  blankToUndefined,
  z
    .string()
    .trim()
    .max(
      VIDEO_URL_MAX,
      `O link deve ter no máximo ${VIDEO_URL_MAX} caracteres.`
    )
    .refine(isHttpUrl, 'Use um link http ou https, sem espaços.')
    .optional()
);

const setsSchema = z.preprocess(
  wholeNumber,
  z
    .number({
      error: `Séries deve ser um número inteiro de ${EXERCISE_SETS_MIN} a ${EXERCISE_SETS_MAX}.`,
    })
    .int(
      `Séries deve ser um número inteiro de ${EXERCISE_SETS_MIN} a ${EXERCISE_SETS_MAX}.`
    )
    .min(
      EXERCISE_SETS_MIN,
      `Séries deve ser de ${EXERCISE_SETS_MIN} a ${EXERCISE_SETS_MAX}.`
    )
    .max(
      EXERCISE_SETS_MAX,
      `Séries deve ser de ${EXERCISE_SETS_MIN} a ${EXERCISE_SETS_MAX}.`
    )
);

const repsSchema = z
  .string()
  .trim()
  .min(1, 'Informe as repetições.')
  .max(
    EXERCISE_REPS_MAX,
    `As repetições devem ter no máximo ${EXERCISE_REPS_MAX} caracteres.`
  );

const loadSchema = z.preprocess(
  blankToUndefined,
  z
    .string()
    .trim()
    .max(
      EXERCISE_LOAD_MAX,
      `A carga deve ter no máximo ${EXERCISE_LOAD_MAX} caracteres.`
    )
    .optional()
);

const exerciseItemShape = z.object({
  id: z.string().optional(),
  source: z.enum(['LIBRARY', 'FREE']),
  exerciseId: z.string().nullable().optional(),
  name: z.string().trim().optional(),
  muscleGroup: z.string().optional(),
  equipment: z.enum(['GYM', 'HOME_BASIC', 'BODYWEIGHT']).nullable().optional(),
  sets: setsSchema,
  reps: repsSchema,
  load: loadSchema,
  videoUrl: videoUrlSchema,
});

/**
 * One exercise as it is sent. A free exercise needs its own name and one of
 * the seven muscle groups; a library exercise needs neither (the server takes
 * both from the library).
 */
export const exerciseItemSchema = exerciseItemShape.superRefine(
  (item, context) => {
    if (item.source !== 'FREE') return;

    if (!item.name) {
      context.addIssue({
        code: 'custom',
        path: ['name'],
        message: 'O nome do exercício é obrigatório.',
      });
    } else if (item.name.length > FREE_EXERCISE_NAME_MAX) {
      context.addIssue({
        code: 'custom',
        path: ['name'],
        message: `O nome deve ter no máximo ${FREE_EXERCISE_NAME_MAX} caracteres.`,
      });
    }
    if (
      !item.muscleGroup ||
      !(MUSCLE_GROUPS as readonly string[]).includes(item.muscleGroup)
    ) {
      context.addIssue({
        code: 'custom',
        path: ['muscleGroup'],
        message: 'Escolha o grupo muscular.',
      });
    }
  }
);

export const workoutSessionSchema = z.object({
  id: z.string().optional(),
  name: sessionNameSchema,
  exercises: z
    .array(exerciseItemSchema)
    .max(
      SESSION_EXERCISES_MAX,
      `Uma sessão pode ter no máximo ${SESSION_EXERCISES_MAX} exercícios.`
    ),
});

/** The whole workout as one save request carries it. */
export const workoutSchema = z.object({
  title: workoutTitleSchema,
  weeklyFrequency: weeklyFrequencySchema,
  sessions: z
    .array(workoutSessionSchema)
    .max(
      WORKOUT_SESSIONS_MAX,
      `Um treino pode ter no máximo ${WORKOUT_SESSIONS_MAX} sessões.`
    ),
});

export type WorkoutPayload = z.output<typeof workoutSchema>;

/** Creating a draft needs only a title and, optionally, the frequency. */
export const createWorkoutSchema = z.object({
  title: workoutTitleSchema,
  weeklyFrequency: weeklyFrequencySchema,
});

export const duplicateInputSchema = z.object({
  studentId: z.string(),
  workoutId: z.string(),
  studentIds: z.array(z.string()).min(1),
});

/** The "add by name" form: a name and one of the seven muscle groups are required. */
export const freeExerciseFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'O nome do exercício é obrigatório.')
    .max(
      FREE_EXERCISE_NAME_MAX,
      `O nome deve ter no máximo ${FREE_EXERCISE_NAME_MAX} caracteres.`
    ),
  muscleGroup: z.enum(MUSCLE_GROUPS, { error: 'Escolha o grupo muscular.' }),
  equipment: z.enum(['GYM', 'HOME_BASIC', 'BODYWEIGHT']).nullable(),
});
