import { describe, expect, it } from 'vitest';
import { PAGE_TITLES } from './pageTitles';

describe('restricted page titles', () => {
  it('UT-031 contains exactly the seven contracted title values', () => {
    expect(Object.values(PAGE_TITLES)).toEqual([
      'Início',
      'Minha evolução',
      'Treinos',
      'Cadastro de treino',
      'Configurações',
      'Pessoas',
      'Cliente',
    ]);
  });

  it('UT-032 contains seven non-empty, pairwise distinct values', () => {
    const titles = Object.values(PAGE_TITLES);

    expect(titles).toHaveLength(7);
    expect(titles.every(title => title.length > 0)).toBe(true);
    expect(new Set(titles).size).toBe(7);
  });
});
