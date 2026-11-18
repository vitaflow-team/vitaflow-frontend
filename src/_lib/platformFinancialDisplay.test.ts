import { describe, expect, it } from 'vitest';
import {
  accountDirectoryHref,
  bandCountRows,
  formatSyncedAt,
  platformIntro,
  platformMonthChanges,
} from './platformFinancialDisplay';

const CURRENT = {
  expectedCents: 12000,
  receivedCents: 5000,
  stillOwedCents: 7000,
};

describe('platformMonthChanges', () => {
  it('compares each figure with the previous month', () => {
    expect(
      platformMonthChanges(CURRENT, {
        expectedCents: 10000,
        receivedCents: 10000,
        stillOwedCents: 7000,
      })
    ).toEqual({ expected: 20, received: -50, stillOwed: 0 });
  });

  it('UT-120 has no change at all without a previous month', () => {
    expect(platformMonthChanges(CURRENT, null)).toEqual({
      expected: null,
      received: null,
      stillOwed: null,
    });
  });

  it('UT-008 has no change for a figure whose previous value is zero', () => {
    expect(
      platformMonthChanges(CURRENT, {
        expectedCents: 0,
        receivedCents: 0,
        stillOwedCents: 0,
      })
    ).toEqual({ expected: null, received: null, stillOwed: null });
  });
});

describe('accountDirectoryHref', () => {
  it('searches the directory by the encoded name', () => {
    expect(accountDirectoryHref('Ana Souza')).toBe(
      '/restrict/backoffice/accounts?busca=Ana%20Souza'
    );
    expect(accountDirectoryHref('a&b=c')).toBe(
      '/restrict/backoffice/accounts?busca=a%26b%3Dc'
    );
  });
});

describe('formatSyncedAt', () => {
  it('writes the date and time in Brasília time', () => {
    expect(formatSyncedAt('2026-11-17T02:30:00.000Z')).toContain('16/11/2026');
    expect(formatSyncedAt('2026-11-17T17:30:00.000Z')).toContain('14:30');
  });
});

describe('platformIntro', () => {
  it('differs by tier, and EQUIPE never hears of received money', () => {
    expect(platformIntro('ADMIN')).toContain('recebido');
    expect(platformIntro('EQUIPE')).not.toMatch(/receb/i);
    expect(platformIntro(null)).toContain('assinaturas');
  });
});

describe('bandCountRows', () => {
  it('labels the three bands in order and adds them up', () => {
    expect(bandCountRows({ d1to7: 4, d8to30: 2, d31Plus: 1 })).toEqual({
      rows: [
        { label: '1–7 dias', count: 4 },
        { label: '8–30 dias', count: 2 },
        { label: '31+ dias', count: 1 },
      ],
      total: 7,
    });
  });
});
