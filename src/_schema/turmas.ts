import { z } from 'zod';

const coercedPositiveInt = (message: string) =>
  z
    .union([z.string(), z.number()])
    .transform(value => Number(value))
    .pipe(z.number().int('Use um número inteiro.').positive(message));

const TIME_PATTERN = /^([01]\d|2[0-3]):[0-5]\d$/;

export const turmaScheduleSchema = z.object({
  name: z.string().trim().min(1, 'Informe um nome para a turma.').max(100),
  weekday: z
    .union([z.string(), z.number()])
    .transform(value => Number(value))
    .pipe(z.number().int().min(1).max(7)),
  startTime: z
    .string()
    .regex(TIME_PATTERN, 'Informe um horário válido (HH:MM).'),
  durationMinutes: coercedPositiveInt('A duração deve ser maior que zero.'),
  capacity: coercedPositiveInt('A capacidade deve ser maior que zero.'),
});

export const createTurmaSchema = turmaScheduleSchema.extend({
  professionalId: z.string().optional(),
});

export type TurmaScheduleFormInput = z.input<typeof turmaScheduleSchema>;
export type TurmaScheduleFormData = z.output<typeof turmaScheduleSchema>;
export type CreateTurmaFormInput = z.input<typeof createTurmaSchema>;
export type CreateTurmaFormData = z.output<typeof createTurmaSchema>;
