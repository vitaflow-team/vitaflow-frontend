import { describe, expect, it } from 'vitest';
import { buildGreetingLine, formatLongDate, getGreeting } from './greeting';

const SAO_PAULO = 'America/Sao_Paulo';

describe('restricted home greeting — getGreeting', () => {
  it('UT-021 greets the night at 04:59 local time', () => {
    expect(getGreeting(new Date('2026-09-19T07:59:00Z'), SAO_PAULO)).toBe(
      'Boa noite'
    );
  });

  it('UT-022 greets the morning from 05:00 local time', () => {
    expect(getGreeting(new Date('2026-09-19T08:00:00Z'), SAO_PAULO)).toBe(
      'Bom dia'
    );
  });

  it('UT-023 still greets the morning at 11:59 local time', () => {
    expect(getGreeting(new Date('2026-09-19T14:59:00Z'), SAO_PAULO)).toBe(
      'Bom dia'
    );
  });

  it('UT-024 greets the afternoon from 12:00 local time', () => {
    expect(getGreeting(new Date('2026-09-19T15:00:00Z'), SAO_PAULO)).toBe(
      'Boa tarde'
    );
  });

  it('UT-025 still greets the afternoon at 17:59 local time', () => {
    expect(getGreeting(new Date('2026-09-19T20:59:00Z'), SAO_PAULO)).toBe(
      'Boa tarde'
    );
  });

  it('UT-026 greets the night from 18:00 local time', () => {
    expect(getGreeting(new Date('2026-09-19T21:00:00Z'), SAO_PAULO)).toBe(
      'Boa noite'
    );
  });

  it('UT-027 uses the given time zone, not UTC', () => {
    // 23:30 in São Paulo is already the next day in UTC.
    expect(getGreeting(new Date('2026-09-20T02:30:00Z'), SAO_PAULO)).toBe(
      'Boa noite'
    );
  });
});

describe('restricted home greeting — formatLongDate', () => {
  it('UT-028 writes the date out in Portuguese', () => {
    expect(formatLongDate(new Date('2026-09-19T15:00:00Z'), SAO_PAULO)).toBe(
      'sábado, 19 de setembro'
    );
  });
});

describe('restricted home greeting — buildGreetingLine', () => {
  it('UT-029 omits the comma when there is no name', () => {
    expect(buildGreetingLine('Bom dia', 'Fernando')).toBe('Bom dia, Fernando');
    expect(buildGreetingLine('Bom dia', '')).toBe('Bom dia');
  });
});
