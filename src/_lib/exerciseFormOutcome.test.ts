import { describe, expect, it } from 'vitest';
import {
  exerciseSaveDestination,
  exerciseSaveMessage,
} from './exerciseFormOutcome';

describe('exercise form outcome', () => {
  it('keeps the educator on the page to follow the submission', () => {
    expect(exerciseSaveDestination({ kind: 'submit' })).toBeNull();
    expect(exerciseSaveMessage({ kind: 'submit' })).toContain(
      'assim que a equipe Vita Flow aprovar'
    );
  });

  it('returns the backoffice to its list after create or edit', () => {
    expect(exerciseSaveDestination({ kind: 'create' })).toBe(
      '/restrict/backoffice/exercises'
    );
    expect(exerciseSaveDestination({ kind: 'edit', id: 'x' })).toBe(
      '/restrict/backoffice/exercises'
    );
    expect(exerciseSaveMessage({ kind: 'create' })).toBe(
      'Exercício publicado no catálogo.'
    );
    expect(exerciseSaveMessage({ kind: 'edit', id: 'x' })).toBe(
      'Exercício atualizado.'
    );
  });
});
