import { describe, expect, it } from 'vitest';
import { PAGE_TITLES } from './pageTitles';

describe('restricted page titles', () => {
  it('UT-031 contains exactly the nineteen contracted title values', () => {
    expect(Object.values(PAGE_TITLES)).toEqual([
      'Início',
      'Minha evolução',
      'Treinos',
      'Cadastro de treino',
      'Configurações',
      'Pessoas',
      'Cliente',
      'Alunos',
      'Aluno',
      'Aluno não encontrado',
      'Diário Alimentar',
      'Buscar profissional',
      'Perfil do profissional',
      'Minha nutricionista',
      'Meu educador físico',
      'Mensagens',
      'Conversa',
      'Agenda',
      'Agendar horário',
    ]);
  });

  it('UT-032 contains nineteen non-empty, pairwise distinct values', () => {
    const titles = Object.values(PAGE_TITLES);

    expect(titles).toHaveLength(19);
    expect(titles.every(title => title.length > 0)).toBe(true);
    expect(new Set(titles).size).toBe(19);
  });

  it('UT-158 includes the students list, the record and the not-found titles', () => {
    expect(PAGE_TITLES.students).toBe('Alunos');
    expect(PAGE_TITLES.student).toBe('Aluno');
    expect(PAGE_TITLES.studentNotFound).toBe('Aluno não encontrado');
  });
});
