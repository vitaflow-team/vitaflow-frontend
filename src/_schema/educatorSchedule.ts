import {
  FIXED_DAY_MINUTES,
  FIXED_DURATION_DEFAULT,
  FIXED_DURATION_MAX,
  FIXED_DURATION_MIN,
  FIXED_ONLINE_LINK_MAX,
  FIXED_START_MAX,
  FIXED_START_STEP,
  FIXED_WEEKDAY_MAX,
  FIXED_WEEKDAY_MIN,
  FIXED_WORKOUT_LETTERS,
} from '@/_constants/educatorScheduleLimits';
import { z } from 'zod';

const isStep = (value: number, step: number) => value % step === 0;

/** An http or https link with no spaces or markup, at most 500 characters. */
export function isHttpLink(value: string): boolean {
  if (value.length > FIXED_ONLINE_LINK_MAX) return false;
  if (/[\s<>"]/.test(value)) return false;
  try {
    const { protocol } = new URL(value);
    return protocol === 'http:' || protocol === 'https:';
  } catch {
    return false;
  }
}

export const fixedTimeFormSchema = z
  .object({
    weekday: z
      .number()
      .int()
      .min(
        FIXED_WEEKDAY_MIN,
        `Escolha um dia da semana (de ${FIXED_WEEKDAY_MIN} a ${FIXED_WEEKDAY_MAX}).`
      )
      .max(
        FIXED_WEEKDAY_MAX,
        `Escolha um dia da semana (de ${FIXED_WEEKDAY_MIN} a ${FIXED_WEEKDAY_MAX}).`
      ),
    startMinute: z
      .number()
      .int()
      .min(0, 'O horário deve estar entre 00:00 e 23:55.')
      .max(FIXED_START_MAX, 'O horário deve estar entre 00:00 e 23:55.')
      .refine(
        value => isStep(value, FIXED_START_STEP),
        'Use horários de 5 em 5 minutos.'
      ),
    durationMinutes: z
      .number()
      .int()
      .min(
        FIXED_DURATION_MIN,
        `A duração deve ser de ${FIXED_DURATION_MIN} a ${FIXED_DURATION_MAX} minutos.`
      )
      .max(
        FIXED_DURATION_MAX,
        `A duração deve ser de ${FIXED_DURATION_MIN} a ${FIXED_DURATION_MAX} minutos.`
      )
      .refine(
        value => isStep(value, FIXED_START_STEP),
        'Use durações de 5 em 5 minutos.'
      ),
    type: z.enum(['PRESENCIAL', 'ONLINE'], {
      error: 'Escolha presencial ou online.',
    }),
    onlineLink: z.string().trim(),
    workoutLetter: z.enum(FIXED_WORKOUT_LETTERS).nullable(),
  })
  .superRefine((value, context) => {
    if (value.startMinute + value.durationMinutes > FIXED_DAY_MINUTES) {
      context.addIssue({
        code: 'custom',
        path: ['durationMinutes'],
        message: 'A sessão precisa terminar no mesmo dia.',
      });
    }
    if (value.type === 'PRESENCIAL' && value.onlineLink !== '') {
      context.addIssue({
        code: 'custom',
        path: ['onlineLink'],
        message: 'Um horário presencial não aceita link.',
      });
    }
    if (
      value.type === 'ONLINE' &&
      value.onlineLink !== '' &&
      !isHttpLink(value.onlineLink)
    ) {
      context.addIssue({
        code: 'custom',
        path: ['onlineLink'],
        message: 'Use um link http ou https, sem espaços.',
      });
    }
  });

export type FixedTimeFormValues = z.infer<typeof fixedTimeFormSchema>;

export const DEFAULT_DURATION = FIXED_DURATION_DEFAULT;
