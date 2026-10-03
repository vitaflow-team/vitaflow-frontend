import { describe, expect, it } from 'vitest';
import {
  parseStudentsParams,
  searchHref,
  studentsHref,
  totalPages,
} from './studentsList';

describe('students list address', () => {
  it('UT-112 searching writes q after trimming and goes back to page 1', () => {
    expect(searchHref('  ana ')).toBe('/restrict/students?q=ana');
    expect(searchHref('joão')).toBe('/restrict/students?q=jo%C3%A3o');
    expect(searchHref('   ')).toBe('/restrict/students');
  });

  it('keeps the page in the address only after page 1', () => {
    expect(studentsHref({ search: 'ana', page: 1 })).toBe(
      '/restrict/students?q=ana'
    );
    expect(studentsHref({ search: 'ana', page: 3 })).toBe(
      '/restrict/students?q=ana&page=3'
    );
    expect(studentsHref({ page: 2 })).toBe('/restrict/students?page=2');
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
      { q: 'ana', page: '2.5' },
      { search: 'ana', page: 1 },
    ],
    [
      { q: ['a', 'b'], page: ['3', '4'] },
      { search: 'a', page: 3 },
    ],
    [
      { q: ' ana ', page: '7' },
      { search: 'ana', page: 7 },
    ],
  ])('reads the address %j as %j', (input, expected) => {
    expect(parseStudentsParams(input)).toEqual(expected);
  });

  it('caps a very long search text', () => {
    const parsed = parseStudentsParams({ q: 'a'.repeat(500) });

    expect(parsed.search).toHaveLength(100);
  });

  it('counts at least one page', () => {
    expect(totalPages(0, 50)).toBe(1);
    expect(totalPages(50, 50)).toBe(1);
    expect(totalPages(51, 50)).toBe(2);
  });
});
