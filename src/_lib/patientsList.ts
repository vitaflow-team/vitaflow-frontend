export const PATIENTS_PATH = '/restrict/patients';

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
  return query ? `${PATIENTS_PATH}?${query}` : PATIENTS_PATH;
}

export function searchHref(search: string): string {
  return patientsHref({ search: search.trim() || undefined });
}
