import type { ExerciseContraindication } from './exerciseContraindication';
import type { ExerciseEquipment } from './exerciseEquipment';
import type { ExerciseStatus } from './exerciseStatus';

/**
 * One catalog entry as the backend returns it. Name and description are shown
 * in whatever language is stored: imported entries may still be in English.
 */
export interface Exercise {
  id: string;
  name: string;
  description: string;
  muscleGroup: string;
  primaryMuscles: string[];
  secondaryMuscles: string[];
  equipment: ExerciseEquipment;
  contraindications: ExerciseContraindication[];
  difficulty: string | null;
  imageUrl: string | null;
  videoUrl: string | null;
  status: ExerciseStatus;
  sourceAttribution: string | null;
  sourceLicense: string | null;
  submittedById: string | null;
  rejectionReason: string | null;
  createdAt: string;
  updatedAt: string;
}
