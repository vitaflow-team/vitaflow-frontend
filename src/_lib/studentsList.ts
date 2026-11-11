// The base for an individual student's own record/tab URLs
// (`/restrict/students/:id/...`) — unrelated to which view currently lives
// at the bare `/restrict/students` route, so this never changes when that
// landing view does.
export const STUDENTS_PATH = '/restrict/students';

// The full student list's own URL (ADR-007): the portfolio dashboard is the
// default landing view at the bare `/restrict/students`, so the list itself
// — and every link meant to go back to it — targets this sub-route instead.
export const STUDENTS_LIST_PATH = '/restrict/students/lista';

const MAX_SEARCH_LENGTH = 100;

export interface StudentsParams {
  search?: string;
  page: number;
  /** 'name' sorts alphabetically; absent means the soonest next session first. */
  order?: 'name';
  /** Only pending or overdue students (US-012, ignored by the backend outside Premium). */
  pending?: boolean;
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
  ordem?: string | string[];
  pendentes?: string | string[];
}): StudentsParams {
  const search = firstValue(input.q)?.trim().slice(0, MAX_SEARCH_LENGTH);
  const page = Number(firstValue(input.page));

  return {
    search: search ? search : undefined,
    page: Number.isInteger(page) && page >= 1 ? page : 1,
    order: firstValue(input.ordem) === 'nome' ? 'name' : undefined,
    pending: firstValue(input.pendentes) === '1' ? true : undefined,
  };
}

/** The list address for a search, page and filter; defaults stay implicit. */
export function studentsHref({
  search,
  page,
  order,
  pending,
}: StudentsParams): string {
  const params = new URLSearchParams();
  if (search) params.set('q', search);
  if (order === 'name') params.set('ordem', 'nome');
  if (pending) params.set('pendentes', '1');
  if (page > 1) params.set('page', String(page));

  const query = params.toString();
  return query ? `${STUDENTS_LIST_PATH}?${query}` : STUDENTS_LIST_PATH;
}

/** Searching starts again from the first page. */
export function searchHref(search: string): string {
  return studentsHref({ search: search.trim() || undefined, page: 1 });
}

export function totalPages(total: number, pageSize: number): number {
  return Math.max(1, Math.ceil(total / pageSize));
}
