import { describe, expect, it } from 'vitest';
import {
  hasActiveFilter,
  parseExerciseFilter,
  toAddressQuery,
  toBackendQuery,
  withFilterChange,
} from './exerciseFilter';

describe('exercise library — filters from the address bar', () => {
  it('reads search, muscle group, equipment and page together', () => {
    expect(
      parseExerciseFilter({
        busca: '  supino ',
        grupo: 'Peito',
        equipamento: 'BODYWEIGHT',
        pagina: '3',
      })
    ).toEqual({
      q: 'supino',
      muscleGroup: 'Peito',
      equipment: 'BODYWEIGHT',
      page: 3,
    });
  });

  it('drops unknown or malformed values instead of failing', () => {
    expect(
      parseExerciseFilter({
        busca: '   ',
        grupo: 'Nonexistent',
        equipamento: 'SPACESHIP',
        pagina: '-2',
      })
    ).toEqual({
      q: undefined,
      muscleGroup: undefined,
      equipment: undefined,
      page: 1,
    });
    expect(parseExerciseFilter({ pagina: '1.5' }).page).toBe(1);
    expect(parseExerciseFilter({ pagina: '0' }).page).toBe(1);
    expect(
      parseExerciseFilter({ grupo: ['Peito', 'Costas'] }).muscleGroup
    ).toBe(undefined);
  });

  it('never treats prototype keys as an equipment value', () => {
    expect(parseExerciseFilter({ equipamento: 'constructor' }).equipment).toBe(
      undefined
    );
  });

  it('caps an unusually long search term (US-003.EC-2)', () => {
    const filter = parseExerciseFilter({ busca: 'a'.repeat(500) });
    expect(filter.q).toHaveLength(120);
  });
});

describe('exercise library — query strings', () => {
  it('sends every active filter to the backend at once (US-011.AC-2)', () => {
    const query = toBackendQuery({
      q: 'supino %',
      muscleGroup: 'Peito',
      equipment: 'BODYWEIGHT',
      page: 2,
    });
    const params = new URLSearchParams(query.slice(1));

    expect(params.get('muscleGroup')).toBe('Peito');
    expect(params.get('equipment')).toBe('BODYWEIGHT');
    expect(params.get('q')).toBe('supino %');
    expect(params.get('page')).toBe('2');
  });

  it('asks for page 1 and nothing else without filters', () => {
    expect(toBackendQuery({ page: 1 })).toBe('?page=1');
  });

  it('builds address links with Portuguese names and an implicit page 1', () => {
    expect(toAddressQuery({ page: 1 })).toBe('');
    expect(
      toAddressQuery({ q: 'remada', muscleGroup: 'Costas', page: 2 })
    ).toBe('?busca=remada&grupo=Costas&pagina=2');
  });

  it('round-trips an address back into the same filter', () => {
    const filter = {
      q: 'agachamento livre',
      muscleGroup: 'Pernas',
      equipment: 'GYM' as const,
      page: 4,
    };
    const params = Object.fromEntries(
      new URLSearchParams(toAddressQuery(filter).slice(1))
    );
    expect(parseExerciseFilter(params)).toEqual(filter);
  });
});

describe('exercise library — filter changes', () => {
  it('keeps the other filters and goes back to the first page', () => {
    expect(
      withFilterChange(
        { q: 'supino', muscleGroup: 'Peito', page: 3 },
        { equipment: 'GYM' }
      )
    ).toEqual({ q: 'supino', muscleGroup: 'Peito', equipment: 'GYM', page: 1 });
  });

  it('clears a filter when it is set to undefined (US-002.AC-2)', () => {
    const cleared = withFilterChange(
      { muscleGroup: 'Peito', page: 1 },
      { muscleGroup: undefined }
    );
    expect(hasActiveFilter(cleared)).toBe(false);
  });

  it('tells whether any search or filter narrows the list', () => {
    expect(hasActiveFilter({ page: 2 })).toBe(false);
    expect(hasActiveFilter({ q: 'x', page: 1 })).toBe(true);
    expect(hasActiveFilter({ equipment: 'GYM', page: 1 })).toBe(true);
  });
});
