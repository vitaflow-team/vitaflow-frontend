export const ACADEMIA_ALUNOS_PATH = '/restrict/academia-alunos';

const MAX_SEARCH_LENGTH = 100;

export type HorarioFilter = 'COM' | 'SEM' | undefined;

export interface AcademiaAlunosParams {
  search?: string;
  horario?: HorarioFilter;
  page: number;
}

function firstValue(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

function parseHorario(value: string | string[] | undefined): HorarioFilter {
  const raw = firstValue(value);
  return raw === 'COM' || raw === 'SEM' ? raw : undefined;
}

export function parseAcademiaAlunosParams(input: {
  q?: string | string[];
  horario?: string | string[];
  page?: string | string[];
}): AcademiaAlunosParams {
  const search = firstValue(input.q)?.trim().slice(0, MAX_SEARCH_LENGTH);
  const page = Number(firstValue(input.page));

  return {
    search: search ? search : undefined,
    horario: parseHorario(input.horario),
    page: Number.isInteger(page) && page >= 1 ? page : 1,
  };
}

export function academiaAlunosHref({
  search,
  horario,
  page,
}: AcademiaAlunosParams): string {
  const params = new URLSearchParams();
  if (search) params.set('q', search);
  if (horario) params.set('horario', horario);
  if (page > 1) params.set('page', String(page));

  const query = params.toString();
  return query ? `${ACADEMIA_ALUNOS_PATH}?${query}` : ACADEMIA_ALUNOS_PATH;
}

export function academiaAlunosSearchHref(
  search: string,
  horario: HorarioFilter
): string {
  return academiaAlunosHref({
    search: search.trim() || undefined,
    horario,
    page: 1,
  });
}

export function totalPages(total: number, pageSize: number): number {
  return Math.max(1, Math.ceil(total / pageSize));
}
