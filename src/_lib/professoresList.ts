export const PROFESSORES_PATH = '/restrict/academia-professores';

const MAX_SEARCH_LENGTH = 100;

export interface ProfessoresParams {
  search?: string;
  page: number;
}

function firstValue(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

export function parseProfessoresParams(input: {
  q?: string | string[];
  page?: string | string[];
}): ProfessoresParams {
  const search = firstValue(input.q)?.trim().slice(0, MAX_SEARCH_LENGTH);
  const page = Number(firstValue(input.page));

  return {
    search: search ? search : undefined,
    page: Number.isInteger(page) && page >= 1 ? page : 1,
  };
}

export function professoresHref({ search, page }: ProfessoresParams): string {
  const params = new URLSearchParams();
  if (search) params.set('q', search);
  if (page > 1) params.set('page', String(page));

  const query = params.toString();
  return query ? `${PROFESSORES_PATH}?${query}` : PROFESSORES_PATH;
}

export function professoresSearchHref(search: string): string {
  return professoresHref({ search: search.trim() || undefined, page: 1 });
}

export function totalPages(total: number, pageSize: number): number {
  return Math.max(1, Math.ceil(total / pageSize));
}
