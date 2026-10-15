import { describe, expect, it } from 'vitest';
import {
  academiaAlunosHref,
  academiaAlunosSearchHref,
  parseAcademiaAlunosParams,
  totalPages,
} from './academiaAlunosList';

describe('academia alunos list address', () => {
  it('searching writes q, keeps horario, and goes back to page 1', () => {
    expect(academiaAlunosSearchHref('  ana ', undefined)).toBe(
      '/restrict/academia-alunos?q=ana'
    );
    expect(academiaAlunosSearchHref('ana', 'COM')).toBe(
      '/restrict/academia-alunos?q=ana&horario=COM'
    );
    expect(academiaAlunosSearchHref('   ', undefined)).toBe(
      '/restrict/academia-alunos'
    );
  });

  it('keeps search, horario and page in the address together', () => {
    expect(academiaAlunosHref({ search: 'ana', horario: 'SEM', page: 3 })).toBe(
      '/restrict/academia-alunos?q=ana&horario=SEM&page=3'
    );
    expect(academiaAlunosHref({ horario: 'COM', page: 1 })).toBe(
      '/restrict/academia-alunos?horario=COM'
    );
    expect(academiaAlunosHref({ page: 1 })).toBe('/restrict/academia-alunos');
  });

  it.each([
    [{}, { search: undefined, horario: undefined, page: 1 }],
    [
      { q: '  ', page: '0' },
      { search: undefined, horario: undefined, page: 1 },
    ],
    [
      { q: 'ana', horario: 'COM', page: '2' },
      { search: 'ana', horario: 'COM', page: 2 },
    ],
    [{ horario: 'SEM' }, { search: undefined, horario: 'SEM', page: 1 }],
    [{ horario: 'bogus' }, { search: undefined, horario: undefined, page: 1 }],
    [
      { q: ['a', 'b'], page: ['3', '4'] },
      { search: 'a', horario: undefined, page: 3 },
    ],
  ])('reads the address %j as %j', (input, expected) => {
    expect(parseAcademiaAlunosParams(input)).toEqual(expected);
  });

  it('computes total pages with at least one page', () => {
    expect(totalPages(0, 50)).toBe(1);
    expect(totalPages(50, 50)).toBe(1);
    expect(totalPages(51, 50)).toBe(2);
  });
});
