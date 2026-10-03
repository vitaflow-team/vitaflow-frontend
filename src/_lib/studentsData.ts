import 'server-only';

import { apiClient } from '@/_lib/apiClient';
import { AppError } from '@/_lib/AppError';
import type { LoadFailure } from '@/_types/loadFailure';
import type { AssessmentList, Student, StudentList } from '@/_types/students';
import { unstable_rethrow } from 'next/navigation';
import { cache } from 'react';
import { z } from 'zod';

const uuidSchema = z.uuid();

function toFailure(error: unknown, source: string): LoadFailure {
  unstable_rethrow(error);
  const status = error instanceof AppError ? error.statusCode : undefined;
  if (status === 401 || status === 403) return 'forbidden';
  if (status === 404) return 'not-found';
  console.error(`Students: ${source} failed.`, { status });
  return 'failed';
}

export function isLoadFailure<T>(
  result: T | LoadFailure
): result is LoadFailure {
  return typeof result === 'string';
}

// The backend's own educator guard is the authority: a caller of another type
// gets a 403, which reads as `forbidden`. Pages add the friendlier redirect.
async function guarded<T>(
  source: string,
  load: () => Promise<T>
): Promise<T | LoadFailure> {
  try {
    return await load();
  } catch (error) {
    return toFailure(error, source);
  }
}

interface ListInput {
  search?: string;
  page: number;
  order?: 'name';
}

export async function loadStudents({
  search,
  page,
  order,
}: ListInput): Promise<StudentList | LoadFailure> {
  const query = new URLSearchParams({ page: String(page) });
  if (search) query.set('search', search);
  if (order) query.set('order', order);

  return await guarded('list', () =>
    apiClient<StudentList>(`/educator/students?${query.toString()}`, {
      method: 'GET',
      cache: 'no-store',
    })
  );
}

/**
 * One request per render: the layout (header) and the pages below it ask for
 * the same student and share a single backend call. A malformed id never
 * reaches the backend and reads as "not found", like an unknown or foreign one.
 */
export const loadStudent = cache(
  async (id: string): Promise<Student | LoadFailure> => {
    if (!uuidSchema.safeParse(id).success) return 'not-found';

    return await guarded('record', () =>
      apiClient<Student>(`/educator/students/${id}`, {
        method: 'GET',
        cache: 'no-store',
      })
    );
  }
);

export async function loadAssessments(
  studentId: string,
  page: number
): Promise<AssessmentList | LoadFailure> {
  if (!uuidSchema.safeParse(studentId).success) return 'not-found';

  return await guarded('assessments', () =>
    apiClient<AssessmentList>(
      `/educator/students/${studentId}/assessments?page=${page}`,
      { method: 'GET', cache: 'no-store' }
    )
  );
}

export async function loadDeclarationAccepted(): Promise<
  boolean | LoadFailure
> {
  const result = await guarded('declaration', () =>
    apiClient<{ accepted: boolean }>('/educator/assessment-declaration', {
      method: 'GET',
      cache: 'no-store',
    })
  );

  return isLoadFailure(result) ? result : result.accepted;
}
