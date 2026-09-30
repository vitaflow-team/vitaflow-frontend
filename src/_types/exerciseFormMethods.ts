import type {
  ExerciseCatalogFormData,
  ExerciseCatalogFormInput,
} from '@/_schema/exerciseCatalog';
import type { UseFormReturn } from 'react-hook-form';

/** The exercise form: raw field values in, validated catalog fields out. */
export type ExerciseFormMethods = UseFormReturn<
  ExerciseCatalogFormInput,
  unknown,
  ExerciseCatalogFormData
>;
