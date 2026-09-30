import type { Exercise } from '@/_types/exercise';
import type {
  ExerciseCatalogFormData,
  ExerciseCatalogFormInput,
} from '@/_schema/exerciseCatalog';

function blankToNull(value: string): string | null {
  return value === '' ? null : value;
}

/**
 * The request body for create, submit and edit. A cleared optional field is
 * sent as `null`, so an edit can remove a video or image instead of keeping
 * the old one.
 */
export function toExercisePayload(values: ExerciseCatalogFormData) {
  return {
    name: values.name,
    description: values.description,
    muscleGroup: values.muscleGroup,
    equipment: values.equipment,
    contraindications: values.contraindications,
    difficulty: blankToNull(values.difficulty),
    imageUrl: blankToNull(values.imageUrl),
    videoUrl: blankToNull(values.videoUrl),
  };
}

export const EMPTY_EXERCISE_FORM: ExerciseCatalogFormInput = {
  name: '',
  description: '',
  muscleGroup: '',
  equipment: '',
  contraindications: [],
  difficulty: '',
  imageUrl: '',
  videoUrl: '',
};

/** Form values for editing a stored exercise. */
export function toExerciseFormInput(
  exercise: Exercise
): ExerciseCatalogFormInput {
  return {
    name: exercise.name,
    description: exercise.description,
    muscleGroup: exercise.muscleGroup,
    equipment: exercise.equipment,
    contraindications: exercise.contraindications,
    difficulty: exercise.difficulty ?? '',
    imageUrl: exercise.imageUrl ?? '',
    videoUrl: exercise.videoUrl ?? '',
  };
}
