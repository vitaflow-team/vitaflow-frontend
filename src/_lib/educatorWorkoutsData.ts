import 'server-only';

import { apiClient } from '@/_lib/apiClient';
import { AppError } from '@/_lib/AppError';
import type {
  StudentEducatorWorkout,
  WorkoutList,
  WorkoutTree,
} from '@/_types/educatorWorkouts';
import type { LoadFailure } from '@/_types/loadFailure';
import type { StudentList, StudentListItem } from '@/_types/students';
import { unstable_rethrow } from 'next/navigation';
import { z } from 'zod';

const uuidSchema = z.uuid();

function toFailure(error: unknown, source: string): LoadFailure {
  unstable_rethrow(error);
  const status = error instanceof AppError ? error.statusCode : undefined;
  if (status === 401 || status === 403) return 'forbidden';
  if (status === 404) return 'not-found';
  console.error(`Educator workouts: ${source} failed.`, { status });
  return 'failed';
}

export function isLoadFailure<T>(
  result: T | LoadFailure
): result is LoadFailure {
  return typeof result === 'string';
}

/** The student's workouts: the active one, the drafts, a page of the archived. */
export async function loadWorkoutList(
  studentId: string,
  archivedPage: number
): Promise<WorkoutList | LoadFailure> {
  if (!uuidSchema.safeParse(studentId).success) return 'not-found';

  try {
    return await apiClient<WorkoutList>(
      `/educator/students/${studentId}/workouts?archivedPage=${archivedPage}`,
      { method: 'GET', cache: 'no-store' }
    );
  } catch (error) {
    return toFailure(error, 'list');
  }
}

/** One workout with its sessions, exercises and conflict marks. */
export async function loadWorkoutTree(
  studentId: string,
  workoutId: string
): Promise<WorkoutTree | LoadFailure> {
  if (
    !uuidSchema.safeParse(studentId).success ||
    !uuidSchema.safeParse(workoutId).success
  ) {
    return 'not-found';
  }

  try {
    return await apiClient<WorkoutTree>(
      `/educator/students/${studentId}/workouts/${workoutId}`,
      { method: 'GET', cache: 'no-store' }
    );
  } catch (error) {
    return toFailure(error, 'tree');
  }
}

const PICKER_PAGES_MAX = 10;

/**
 * Every student of the educator (up to 500) for the duplicate dialog, read
 * page by page; the dialog filters them on the page.
 */
async function readAllStudents(): Promise<StudentListItem[]> {
  const students: StudentListItem[] = [];

  for (let page = 1; page <= PICKER_PAGES_MAX; page += 1) {
    const result = await apiClient<StudentList>(
      `/educator/students?page=${page}`,
      { method: 'GET', cache: 'no-store' }
    );
    students.push(...result.items);
    if (students.length >= result.total) break;
  }
  return students;
}

export async function loadStudentsForPicker(): Promise<
  StudentListItem[] | LoadFailure
> {
  try {
    return await readAllStudents();
  } catch (error) {
    return toFailure(error, 'students');
  }
}

/** The active workouts the caller's educators built for them (read-only). */
export async function loadMyEducatorWorkouts(): Promise<
  StudentEducatorWorkout[] | LoadFailure
> {
  try {
    const result = await apiClient<{ workouts: StudentEducatorWorkout[] }>(
      '/me/educator-workouts',
      { method: 'GET', cache: 'no-store' }
    );
    return result.workouts;
  } catch (error) {
    return toFailure(error, 'student read');
  }
}
