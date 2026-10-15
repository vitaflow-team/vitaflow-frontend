import {
  registerStudentSchema,
  type StudentFormValues,
} from '@/_schema/students';
import { z } from 'zod';

export const registerAcademiaStudentSchema = registerStudentSchema.extend({
  professionalId: z.string().optional(),
});

export type RegisterAcademiaStudentData = z.output<
  typeof registerAcademiaStudentSchema
>;

/** What the registration form holds while typing: every value is text. */
export interface RegisterAcademiaStudentFormValues extends StudentFormValues {
  professionalId: string;
}
