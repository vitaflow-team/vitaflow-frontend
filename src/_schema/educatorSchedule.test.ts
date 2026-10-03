import { describe, expect, it } from 'vitest';
import { fixedTimeFormSchema, isHttpLink } from './educatorSchedule';

const valid = {
  weekday: 1,
  startMinute: 420,
  durationMinutes: 60,
  type: 'PRESENCIAL' as const,
  onlineLink: '',
  workoutLetter: null,
};

function messagesOf(input: Record<string, unknown>): string[] {
  const result = fixedTimeFormSchema.safeParse({ ...valid, ...input });
  return result.success ? [] : result.error.issues.map(issue => issue.message);
}

describe('fixed time schema (UT-100)', () => {
  it('accepts a valid presencial time without a link', () => {
    expect(fixedTimeFormSchema.safeParse(valid).success).toBe(true);
  });

  it('rejects a weekday outside 1–7, a start off the five-minute step and a duration outside 15–240', () => {
    expect(messagesOf({ weekday: 0 })[0]).toContain('de 1 a 7');
    expect(messagesOf({ weekday: 8 })[0]).toContain('de 1 a 7');
    expect(messagesOf({ startMinute: 423 })).toContain(
      'Use horários de 5 em 5 minutos.'
    );
    expect(messagesOf({ startMinute: 1440 })[0]).toContain('23:55');
    expect(messagesOf({ durationMinutes: 10 })[0]).toContain('de 15 a 240');
    expect(messagesOf({ durationMinutes: 247 })[0]).toContain('de 15 a 240');
  });

  it('rejects a session that ends after midnight', () => {
    expect(messagesOf({ startMinute: 1380, durationMinutes: 120 })).toContain(
      'A sessão precisa terminar no mesmo dia.'
    );
  });

  it('rejects a link for presencial and a non-http link for online, with a message', () => {
    expect(messagesOf({ onlineLink: 'https://x.com' })).toContain(
      'Um horário presencial não aceita link.'
    );
    expect(
      messagesOf({ type: 'ONLINE', onlineLink: 'javascript:alert(1)' })
    ).toContain('Use um link http ou https, sem espaços.');
  });

  it('rejects a letter outside A–G', () => {
    expect(
      fixedTimeFormSchema.safeParse({ ...valid, workoutLetter: 'H' }).success
    ).toBe(false);
    expect(
      fixedTimeFormSchema.safeParse({ ...valid, workoutLetter: 'G' }).success
    ).toBe(true);
  });

  it('accepts exactly 500 characters of link and rejects 501', () => {
    const base = 'https://x.com/';
    expect(isHttpLink(base + 'a'.repeat(500 - base.length))).toBe(true);
    expect(isHttpLink(base + 'a'.repeat(501 - base.length))).toBe(false);
  });
});
