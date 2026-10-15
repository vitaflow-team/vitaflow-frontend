import { describe, expect, it } from 'vitest';
import { createTurmaSchema, turmaScheduleSchema } from './turmas';

const VALID = {
  name: 'Spinning',
  weekday: 2,
  startTime: '08:00',
  durationMinutes: 60,
  capacity: 10,
};

describe('turma schedule schema', () => {
  it('accepts a valid schedule and coerces numeric string inputs', () => {
    const result = turmaScheduleSchema.safeParse({
      ...VALID,
      weekday: '2',
      durationMinutes: '60',
      capacity: '10',
    });

    expect(result.success).toBe(true);
    expect(result.data).toMatchObject({
      weekday: 2,
      durationMinutes: 60,
      capacity: 10,
    });
  });

  it('rejects an invalid time string', () => {
    const result = turmaScheduleSchema.safeParse({
      ...VALID,
      startTime: '25:00',
    });
    expect(result.success).toBe(false);
  });

  it('rejects a non-positive capacity', () => {
    const result = turmaScheduleSchema.safeParse({ ...VALID, capacity: 0 });
    expect(result.success).toBe(false);
  });

  it('rejects a weekday outside 1..7', () => {
    const result = turmaScheduleSchema.safeParse({ ...VALID, weekday: 8 });
    expect(result.success).toBe(false);
  });

  it('createTurmaSchema accepts an optional professionalId', () => {
    const result = createTurmaSchema.safeParse({
      ...VALID,
      professionalId: 'educator-1',
    });
    expect(result.success).toBe(true);
  });
});
