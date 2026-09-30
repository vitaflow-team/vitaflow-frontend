import type { ExerciseFilter } from './exerciseFilter';

/** Filters the user can change; `page` always follows from them. */
export type ExerciseFilterChange = Partial<Omit<ExerciseFilter, 'page'>>;
