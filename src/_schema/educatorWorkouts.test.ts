import { MUSCLE_GROUPS } from '@/_constants/exerciseCatalog';
import { describe, expect, it } from 'vitest';
import {
  exerciseItemSchema,
  freeExerciseFormSchema,
  videoUrlSchema,
  workoutSchema,
} from './educatorWorkouts';

const FREE = {
  source: 'FREE',
  name: 'Remada curvada',
  muscleGroup: 'Costas',
  sets: '3',
  reps: '10',
};

function messageOf(
  result: { success: false; error: { issues: { message: string }[] } } | object
) {
  return 'error' in result ? result.error.issues[0].message : '';
}

describe('workout schema', () => {
  it('UT-078 rejects a blank or long title, a blank or long session name and a frequency outside 1–7', () => {
    const base = { title: 'Hipertrofia', sessions: [] };

    expect(workoutSchema.safeParse({ ...base, title: '   ' }).success).toBe(
      false
    );
    const longTitle = workoutSchema.safeParse({
      ...base,
      title: 'a'.repeat(81),
    });
    expect(messageOf(longTitle)).toContain('80');

    const blankSession = workoutSchema.safeParse({
      ...base,
      sessions: [{ name: ' ', exercises: [] }],
    });
    expect(messageOf(blankSession)).toBe('O nome da sessão é obrigatório.');
    const longSession = workoutSchema.safeParse({
      ...base,
      sessions: [{ name: 'a'.repeat(61), exercises: [] }],
    });
    expect(messageOf(longSession)).toContain('60');

    for (const value of ['0', '8', '2.5', 'abc', '-1']) {
      const result = workoutSchema.safeParse({
        ...base,
        weeklyFrequency: value,
      });
      expect(result.success).toBe(false);
      expect(messageOf(result)).toContain('1');
      expect(messageOf(result)).toContain('7');
    }
  });

  it('accepts a frequency from 1 to 7 and an unset one', () => {
    const base = { title: 'Hipertrofia', sessions: [] };

    for (const value of ['1', '7', ' 3 ']) {
      expect(
        workoutSchema.safeParse({ ...base, weeklyFrequency: value }).success
      ).toBe(true);
    }
    const unset = workoutSchema.safeParse({ ...base, weeklyFrequency: '' });
    expect(unset.success && unset.data.weeklyFrequency).toBeUndefined();
  });

  it('caps the sessions at seven and the exercises of a session at thirty', () => {
    const sessions = Array.from({ length: 8 }, () => ({
      name: 'A',
      exercises: [],
    }));
    expect(workoutSchema.safeParse({ title: 'T', sessions }).success).toBe(
      false
    );

    const exercises = Array.from({ length: 31 }, () => FREE);
    expect(
      workoutSchema.safeParse({
        title: 'T',
        sessions: [{ name: 'A', exercises }],
      }).success
    ).toBe(false);
  });
});

describe('exercise schema', () => {
  it('UT-079 rejects series outside 1–20, blank or long repetitions and a long load', () => {
    for (const sets of ['0', '21', '1.5', 'x', '']) {
      const result = exerciseItemSchema.safeParse({ ...FREE, sets });
      expect(result.success, `sets ${sets}`).toBe(false);
      expect(messageOf(result)).toContain('1 a 20');
    }
    expect(exerciseItemSchema.safeParse({ ...FREE, sets: '20' }).success).toBe(
      true
    );

    expect(
      messageOf(exerciseItemSchema.safeParse({ ...FREE, reps: ' ' }))
    ).toBe('Informe as repetições.');
    const longReps = exerciseItemSchema.safeParse({
      ...FREE,
      reps: 'a'.repeat(31),
    });
    expect(messageOf(longReps)).toContain('30');

    const longLoad = exerciseItemSchema.safeParse({
      ...FREE,
      load: 'a'.repeat(31),
    });
    expect(messageOf(longLoad)).toContain('30');
    expect(
      exerciseItemSchema.safeParse({ ...FREE, load: 'a'.repeat(30) }).success
    ).toBe(true);
  });

  it('UT-081 requires name and muscle group for a free exercise and neither for a library one', () => {
    const noName = exerciseItemSchema.safeParse({ ...FREE, name: ' ' });
    expect(messageOf(noName)).toBe('O nome do exercício é obrigatório.');

    const noGroup = exerciseItemSchema.safeParse({
      ...FREE,
      muscleGroup: undefined,
    });
    expect(messageOf(noGroup)).toBe('Escolha o grupo muscular.');
    const wrongGroup = exerciseItemSchema.safeParse({
      ...FREE,
      muscleGroup: 'Antebraço',
    });
    expect(wrongGroup.success).toBe(false);

    const library = exerciseItemSchema.safeParse({
      source: 'LIBRARY',
      exerciseId: 'e1',
      sets: '3',
      reps: '10',
    });
    expect(library.success).toBe(true);
  });

  it('keeps markup in text fields as plain text', () => {
    const result = exerciseItemSchema.safeParse({
      ...FREE,
      name: '<img src=x onerror=alert(1)>',
      load: '<b>20</b> kg',
    });

    expect(result.success && result.data.name).toBe(
      '<img src=x onerror=alert(1)>'
    );
  });
});

describe('video link schema', () => {
  it('UT-080 accepts only http and https links without spaces up to 500 characters', () => {
    for (const value of [
      'ftp://example.com/v',
      'javascript:alert(1)',
      'data:text/html,<b>x</b>',
      'example.com/video',
      'https://example.com/a video',
      `https://example.com/${'a'.repeat(500)}`,
    ]) {
      expect(videoUrlSchema.safeParse(value).success, value).toBe(false);
    }

    for (const value of ['http://example.com/v', 'https://youtu.be/abc']) {
      expect(videoUrlSchema.safeParse(value).success, value).toBe(true);
    }
  });

  it('treats a blank link as not provided', () => {
    const result = videoUrlSchema.safeParse('   ');

    expect(result.success && result.data).toBeUndefined();
  });
});

describe('free exercise form schema', () => {
  it('UT-103 requires a name and one of the seven catalog groups, equipment optional', () => {
    const ok = freeExerciseFormSchema.safeParse({
      name: ' Remada ',
      muscleGroup: 'Costas',
      equipment: null,
    });
    expect(ok.success && ok.data.name).toBe('Remada');

    expect(
      freeExerciseFormSchema.safeParse({
        name: '',
        muscleGroup: 'Costas',
        equipment: null,
      }).success
    ).toBe(false);
    expect(
      freeExerciseFormSchema.safeParse({
        name: 'x',
        muscleGroup: '',
        equipment: null,
      }).success
    ).toBe(false);
  });
});

describe('muscle groups', () => {
  it('UT-082 are the seven values of the backend catalog', () => {
    expect([...MUSCLE_GROUPS]).toEqual([
      'Abdômen',
      'Braços',
      'Costas',
      'Ombros',
      'Panturrilhas',
      'Peito',
      'Pernas',
    ]);
  });
});
