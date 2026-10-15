import { describe, expect, it } from 'vitest';
import {
  parseProfessoresParams,
  professoresHref,
  professoresSearchHref,
  totalPages,
} from './professoresList';

describe('professores list address', () => {
  it('searching writes q after trimming and goes back to page 1', () => {
    expect(professoresSearchHref('  ana ')).toBe(
      '/restrict/academia-professores?q=ana'
    );
    expect(professoresSearchHref('   ')).toBe('/restrict/academia-professores');
  });

  it('keeps the page in the address only after page 1', () => {
    expect(professoresHref({ search: 'ana', page: 1 })).toBe(
      '/restrict/academia-professores?q=ana'
    );
    expect(professoresHref({ search: 'ana', page: 3 })).toBe(
      '/restrict/academia-professores?q=ana&page=3'
    );
    expect(professoresHref({ page: 2 })).toBe(
      '/restrict/academia-professores?page=2'
    );
  });

  it.each([
    [{}, { search: undefined, page: 1 }],
    [
      { q: '  ', page: '0' },
      { search: undefined, page: 1 },
    ],
    [
      { q: 'ana', page: '-4' },
      { search: 'ana', page: 1 },
    ],
    [
      { q: 'ana', page: 'abc' },
      { search: 'ana', page: 1 },
    ],
    [
      { q: ['a', 'b'], page: ['3', '4'] },
      { search: 'a', page: 3 },
    ],
  ])('reads the address %j as %j', (input, expected) => {
    expect(parseProfessoresParams(input)).toEqual(expected);
  });

  it('computes total pages with at least one page', () => {
    expect(totalPages(0, 50)).toBe(1);
    expect(totalPages(50, 50)).toBe(1);
    expect(totalPages(51, 50)).toBe(2);
  });
});
