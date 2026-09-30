import type { ExerciseEquipment } from './exerciseEquipment';

/** Catalog filters read from the address bar; every one is optional. */
export interface ExerciseFilter {
  q?: string;
  muscleGroup?: string;
  equipment?: ExerciseEquipment;
  page: number;
}
