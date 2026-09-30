import {
  EMPTY_EXERCISE_FORM,
  toExerciseFormInput,
  toExercisePayload,
} from '@/_lib/exercisePayload';
import type { Exercise } from '@/_types/exercise';
import { describe, expect, it } from 'vitest';
import { exerciseCatalogSchema } from './exerciseCatalog';

const VALID = {
  ...EMPTY_EXERCISE_FORM,
  name: 'Supino reto',
  description: 'Deitado no banco, empurre a barra.',
  muscleGroup: 'Peito',
  equipment: 'GYM',
};

function issues(values: object): string[] {
  const result = exerciseCatalogSchema.safeParse(values);
  return result.success ? [] : result.error.issues.map(issue => issue.message);
}

describe('exercise form schema', () => {
  it('accepts the four required fields with every optional one blank', () => {
    expect(issues(VALID)).toEqual([]);
  });

  it('names each missing required field (US-006.EC-1)', () => {
    expect(issues(EMPTY_EXERCISE_FORM)).toEqual([
      'O nome do exercício é obrigatório.',
      'A descrição do exercício é obrigatória.',
      'Escolha o grupo muscular.',
      'Escolha o equipamento.',
    ]);
  });

  it('never accepts a blank name, spaces included (US-010.EC-3)', () => {
    expect(issues({ ...VALID, name: '   ' })).toEqual([
      'O nome do exercício é obrigatório.',
    ]);
  });

  it('only accepts web links for video and image', () => {
    expect(issues({ ...VALID, videoUrl: 'javascript:alert(1)' })).toEqual([
      'Informe um link de vídeo válido.',
    ]);
    expect(issues({ ...VALID, imageUrl: 'not a link' })).toEqual([
      'Informe um link de imagem válido.',
    ]);
    expect(issues({ ...VALID, videoUrl: 'https://youtu.be/x' })).toEqual([]);
  });

  it('accepts only known contraindications', () => {
    expect(issues({ ...VALID, contraindications: ['KNEE', 'SPINE'] })).toEqual(
      []
    );
    expect(issues({ ...VALID, contraindications: ['ELBOW'] })).toHaveLength(1);
  });
});

describe('exercise form payload', () => {
  it('sends a cleared optional field as null so an edit can remove it', () => {
    const parsed = exerciseCatalogSchema.parse({
      ...VALID,
      contraindications: ['KNEE'],
    });

    expect(toExercisePayload(parsed)).toEqual({
      name: 'Supino reto',
      description: 'Deitado no banco, empurre a barra.',
      muscleGroup: 'Peito',
      equipment: 'GYM',
      contraindications: ['KNEE'],
      difficulty: null,
      imageUrl: null,
      videoUrl: null,
    });
  });

  it('fills the edit form from a stored exercise', () => {
    const exercise = {
      name: 'Bench Press',
      description: 'Push.',
      muscleGroup: 'Peito',
      equipment: 'GYM',
      contraindications: ['SHOULDER'],
      difficulty: null,
      imageUrl: null,
      videoUrl: 'https://youtu.be/x',
    } as Exercise;

    expect(toExerciseFormInput(exercise)).toEqual({
      name: 'Bench Press',
      description: 'Push.',
      muscleGroup: 'Peito',
      equipment: 'GYM',
      contraindications: ['SHOULDER'],
      difficulty: '',
      imageUrl: '',
      videoUrl: 'https://youtu.be/x',
    });
  });
});
