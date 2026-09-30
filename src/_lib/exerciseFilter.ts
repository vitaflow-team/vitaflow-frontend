import { EQUIPMENT_LABELS, MUSCLE_GROUPS } from '@/_constants/exerciseCatalog';
import type { ExerciseEquipment } from '@/_types/exerciseEquipment';
import type { ExerciseFilter } from '@/_types/exerciseFilter';
import type { ExerciseFilterChange } from '@/_types/exerciseFilterChange';
import type { ExerciseSearchParams } from '@/_types/exerciseSearchParams';

const MAX_SEARCH_LENGTH = 120;
const MAX_PAGE = 10_000;

function single(value: string | string[] | undefined): string | undefined {
  return typeof value === 'string' ? value : undefined;
}

function parseSearch(value: string | undefined): string | undefined {
  const trimmed = value?.trim().slice(0, MAX_SEARCH_LENGTH);
  return trimmed ? trimmed : undefined;
}

function parseMuscleGroup(value: string | undefined): string | undefined {
  return MUSCLE_GROUPS.find(group => group === value);
}

function parseEquipment(
  value: string | undefined
): ExerciseEquipment | undefined {
  if (value === undefined || !Object.hasOwn(EQUIPMENT_LABELS, value)) {
    return undefined;
  }
  return value as ExerciseEquipment;
}

function parsePage(value: string | undefined): number {
  if (!value || !/^\d{1,5}$/.test(value)) return 1;
  const page = Number(value);
  return page >= 1 && page <= MAX_PAGE ? page : 1;
}

/**
 * Reads the filters from the address bar. An unknown group, equipment or page
 * is dropped silently: a hand-edited URL shows the catalog, never an error.
 */
export function parseExerciseFilter(
  params: ExerciseSearchParams
): ExerciseFilter {
  return {
    q: parseSearch(single(params.busca)),
    muscleGroup: parseMuscleGroup(single(params.grupo)),
    equipment: parseEquipment(single(params.equipamento)),
    page: parsePage(single(params.pagina)),
  };
}

export function hasActiveFilter(filter: ExerciseFilter): boolean {
  return Boolean(filter.q || filter.muscleGroup || filter.equipment);
}

/** Applies a filter change; any change starts again from the first page. */
export function withFilterChange(
  filter: ExerciseFilter,
  change: ExerciseFilterChange
): ExerciseFilter {
  return { ...filter, ...change, page: 1 };
}

/** Query string for `GET /exercises`; all filters apply together. */
export function toBackendQuery(filter: ExerciseFilter): string {
  const params = new URLSearchParams();
  if (filter.muscleGroup) params.set('muscleGroup', filter.muscleGroup);
  if (filter.equipment) params.set('equipment', filter.equipment);
  if (filter.q) params.set('q', filter.q);
  params.set('page', String(filter.page));
  return `?${params.toString()}`;
}

/** Query string for a catalog link; the first page is left implicit. */
export function toAddressQuery(filter: ExerciseFilter): string {
  const params = new URLSearchParams();
  if (filter.q) params.set('busca', filter.q);
  if (filter.muscleGroup) params.set('grupo', filter.muscleGroup);
  if (filter.equipment) params.set('equipamento', filter.equipment);
  if (filter.page > 1) params.set('pagina', String(filter.page));
  const query = params.toString();
  return query ? `?${query}` : '';
}
