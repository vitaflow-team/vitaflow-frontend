import { z } from 'zod';

/** The input of the fixed-time actions: the student and the values as the API takes them. */
export const fixedTimeInputSchema = z.object({
  studentId: z.string(),
  weekday: z.number(),
  startMinute: z.number(),
  durationMinutes: z.number(),
  type: z.enum(['PRESENCIAL', 'ONLINE']),
  onlineLink: z.string().nullable(),
  workoutLetter: z.string().nullable(),
});
