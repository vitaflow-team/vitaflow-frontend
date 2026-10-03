export const STUDENTS_PATH = '/restrict/students';

const MAX_SEARCH_LENGTH = 100;

export interface StudentsParams {
  search?: string;
  page: number;
}

function firstValue(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

/**
 * `?q=` and `?page=` come from the address bar: repeated, blank, negative or
 * not a number is never an error, it falls back to "everything, page 1".
 */
export function parseStudentsParams(input: {
  q?: string | string[];
  page?: string | string[];
}): StudentsParams {
  const search = firstValue(input.q)?.trim().slice(0, MAX_SEARCH_LENGTH);
  const page = Number(firstValue(input.page));

  return {
    search: search ? search : undefined,
    page: Number.isInteger(page) && page >= 1 ? page : 1,
  };
}

/** The list address for a search and page; page 1 and no search stay implicit. */
export function studentsHref({ search, page }: StudentsParams): string {
  const params = new URLSearchParams();
  if (search) params.set('q', search);
  if (page > 1) params.set('page', String(page));

  const query = params.toString();
  return query ? `${STUDENTS_PATH}?${query}` : STUDENTS_PATH;
}

/** Searching starts again from the first page. */
export function searchHref(search: string): string {
  return studentsHref({ search: search.trim() || undefined, page: 1 });
}

export function totalPages(total: number, pageSize: number): number {
  return Math.max(1, Math.ceil(total / pageSize));
}
