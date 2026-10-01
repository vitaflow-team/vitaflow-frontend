import type {
  ProfessionalFilter,
  ProfessionalFilterChange,
} from '@/_types/professionalFilter';
import type { ProfessionalSearchParams } from '@/_types/professionalSearchParams';

const MAX_SEARCH_LENGTH = 120;
const PROFESSIONAL_TYPES = ['NUTRITIONIST', 'PHYSICAL_EDUCATOR'] as const;

function single(value: string | string[] | undefined): string | undefined {
  return typeof value === 'string' ? value : undefined;
}

function parseSearch(value: string | undefined): string | undefined {
  const trimmed = value?.trim().slice(0, MAX_SEARCH_LENGTH);
  return trimmed ? trimmed : undefined;
}

function parseType(value: string | undefined): ProfessionalFilter['type'] {
  return PROFESSIONAL_TYPES.find(type => type === value);
}

function parsePriceMax(value: string | undefined): number | undefined {
  if (!value || !/^\d{1,7}([.,]\d{1,2})?$/.test(value)) return undefined;
  const parsed = Number(value.replace(',', '.'));
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : undefined;
}

function parseOnline(value: string | undefined): boolean | undefined {
  return value === 'true' ? true : undefined;
}

/**
 * Reads the filters from the address bar. An unknown type or a malformed
 * price is dropped silently: a hand-edited URL shows the catalog, never an
 * error.
 */
export function parseProfessionalFilter(
  params: ProfessionalSearchParams
): ProfessionalFilter {
  return {
    type: parseType(single(params.tipo)),
    specialty: parseSearch(single(params.busca)),
    priceMax: parsePriceMax(single(params.precoMax)),
    online: parseOnline(single(params.online)),
  };
}

export function hasActiveFilter(filter: ProfessionalFilter): boolean {
  return Boolean(
    filter.type ||
      filter.specialty ||
      filter.priceMax !== undefined ||
      filter.online
  );
}

export function withFilterChange(
  filter: ProfessionalFilter,
  change: ProfessionalFilterChange
): ProfessionalFilter {
  return { ...filter, ...change };
}

/** Query string for `GET /professionals`; every filter applies together. */
export function toBackendQuery(filter: ProfessionalFilter): string {
  const params = new URLSearchParams();
  if (filter.type) params.set('type', filter.type);
  if (filter.specialty) params.set('specialty', filter.specialty);
  if (filter.priceMax !== undefined) {
    params.set('priceMax', String(filter.priceMax));
  }
  if (filter.online) params.set('online', 'true');
  const query = params.toString();
  return query ? `?${query}` : '';
}

/** Query string for the address bar. */
export function toAddressQuery(filter: ProfessionalFilter): string {
  const params = new URLSearchParams();
  if (filter.type) params.set('tipo', filter.type);
  if (filter.specialty) params.set('busca', filter.specialty);
  if (filter.priceMax !== undefined) {
    params.set('precoMax', String(filter.priceMax));
  }
  if (filter.online) params.set('online', 'true');
  const query = params.toString();
  return query ? `?${query}` : '';
}
