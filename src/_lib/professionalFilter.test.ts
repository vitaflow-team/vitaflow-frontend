import { describe, expect, it } from 'vitest';
import {
  hasActiveFilter,
  parseProfessionalFilter,
  toAddressQuery,
  toBackendQuery,
  withFilterChange,
} from './professionalFilter';

describe('professional discovery — filters from the address bar', () => {
  it('reads type, specialty, price and online together', () => {
    expect(
      parseProfessionalFilter({
        tipo: 'NUTRITIONIST',
        busca: '  esportiva ',
        precoMax: '200',
        online: 'true',
      })
    ).toEqual({
      type: 'NUTRITIONIST',
      specialty: 'esportiva',
      priceMax: 200,
      online: true,
    });
  });

  it('drops unknown or malformed values instead of failing', () => {
    expect(
      parseProfessionalFilter({
        tipo: 'ADMIN',
        busca: '   ',
        precoMax: 'abc',
        online: 'yes',
      })
    ).toEqual({
      type: undefined,
      specialty: undefined,
      priceMax: undefined,
      online: undefined,
    });
    expect(
      parseProfessionalFilter({ tipo: ['NUTRITIONIST', 'PHYSICAL_EDUCATOR'] })
        .type
    ).toBe(undefined);
  });

  it('caps an unusually long search term', () => {
    const filter = parseProfessionalFilter({ busca: 'a'.repeat(500) });
    expect(filter.specialty).toHaveLength(120);
  });

  it('accepts a comma decimal price', () => {
    expect(parseProfessionalFilter({ precoMax: '199,90' }).priceMax).toBe(
      199.9
    );
  });
});

describe('professional discovery — query strings', () => {
  it('sends every active filter to the backend at once (US-001/US-002)', () => {
    const query = toBackendQuery({
      type: 'PHYSICAL_EDUCATOR',
      specialty: 'funcional',
      priceMax: 200,
      online: true,
    });
    const params = new URLSearchParams(query.slice(1));

    expect(params.get('type')).toBe('PHYSICAL_EDUCATOR');
    expect(params.get('specialty')).toBe('funcional');
    expect(params.get('priceMax')).toBe('200');
    expect(params.get('online')).toBe('true');
  });

  it('asks for nothing without any filter', () => {
    expect(toBackendQuery({})).toBe('');
  });

  it('builds address links with Portuguese names', () => {
    expect(toAddressQuery({})).toBe('');
    expect(toAddressQuery({ specialty: 'nutrição', priceMax: 150 })).toBe(
      '?busca=nutri%C3%A7%C3%A3o&precoMax=150'
    );
  });

  it('round-trips an address back into the same filter', () => {
    const filter = {
      type: 'NUTRITIONIST' as const,
      specialty: 'low carb',
      priceMax: 180,
      online: true,
    };
    const params = Object.fromEntries(
      new URLSearchParams(toAddressQuery(filter).slice(1))
    );
    expect(parseProfessionalFilter(params)).toEqual(filter);
  });
});

describe('professional discovery — filter changes', () => {
  it('keeps the other filters when one changes', () => {
    expect(
      withFilterChange(
        { type: 'NUTRITIONIST', specialty: 'esportiva' },
        { online: true }
      )
    ).toEqual({ type: 'NUTRITIONIST', specialty: 'esportiva', online: true });
  });

  it('clears a filter when it is set to undefined', () => {
    const cleared = withFilterChange(
      { specialty: 'esportiva' },
      { specialty: undefined }
    );
    expect(hasActiveFilter(cleared)).toBe(false);
  });

  it('tells whether any filter narrows the list', () => {
    expect(hasActiveFilter({})).toBe(false);
    expect(hasActiveFilter({ type: 'NUTRITIONIST' })).toBe(true);
    expect(hasActiveFilter({ priceMax: 0 })).toBe(true);
  });
});
