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

export interface RegisterAcademiaStudentFormValues extends StudentFormValues {
  professionalId: string;
}
