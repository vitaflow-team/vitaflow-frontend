// The base for an individual patient's own record/tab URLs
// (`/restrict/patients/:id/...`) — unrelated to which view currently lives
// at the bare `/restrict/patients` route, so this never changes when that
// landing view does.
export const PATIENTS_PATH = '/restrict/patients';

// The full patient list's own URL (ADR-007): the portfolio dashboard is the
// default landing view at the bare `/restrict/patients`, so the list itself
// — and every link meant to go back to it — targets this sub-route instead.
export const PATIENTS_LIST_PATH = '/restrict/patients/lista';

const MAX_SEARCH_LENGTH = 100;

export interface PatientsParams {
  search?: string;
}

function firstValue(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

/** `?q=` comes from the address bar: repeated or blank is never an error. */
export function parsePatientsParams(input: {
  q?: string | string[];
}): PatientsParams {
  const search = firstValue(input.q)?.trim().slice(0, MAX_SEARCH_LENGTH);
  return { search: search ? search : undefined };
}

/** The list address for a search; no search stays implicit. */
export function patientsHref({ search }: PatientsParams): string {
  const params = new URLSearchParams();
  if (search) params.set('q', search);

  const query = params.toString();
  return query ? `${PATIENTS_LIST_PATH}?${query}` : PATIENTS_LIST_PATH;
}

export function searchHref(search: string): string {
  return patientsHref({ search: search.trim() || undefined });
}
