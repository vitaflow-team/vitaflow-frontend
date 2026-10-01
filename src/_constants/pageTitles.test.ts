import { describe, expect, it } from 'vitest';
import { PAGE_TITLES } from './pageTitles';

describe('restricted page titles', () => {
  it('UT-031 contains exactly the twelve contracted title values', () => {
    expect(Object.values(PAGE_TITLES)).toEqual([
      'Início',
      'Minha evolução',
      'Treinos',
      'Cadastro de treino',
      'Configurações',
      'Pessoas',
      'Cliente',
      'Diário Alimentar',
      'Buscar profissional',
      'Perfil do profissional',
      'Minha nutricionista',
      'Meu educador físico',
    ]);
  });

  it('UT-032 contains twelve non-empty, pairwise distinct values', () => {
    const titles = Object.values(PAGE_TITLES);

    expect(titles).toHaveLength(12);
    expect(titles.every(title => title.length > 0)).toBe(true);
    expect(new Set(titles).size).toBe(12);
  });
});
