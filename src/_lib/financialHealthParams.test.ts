import { describe, expect, it } from 'vitest';
import {
  monthLabel,
  monthOptions,
  normalizeMonth,
  normalizePage,
  panelHref,
  resolvePanelQuery,
} from './financialHealthParams';

const TODAY = '2026-11-17';

describe('financial health address parameters', () => {
  it.each([
    ['2026-13', '2026-11'],
    ['abc', '2026-11'],
    ['2027-01', '2026-11'],
    [undefined, '2026-11'],
    ['2025-10', '2026-11'],
    ['2026-03', '2026-03'],
  ])(
    'UT-130 normalizeMonth(%s) with today 2026-11-17 is %s',
    (raw, expected) => {
      expect(normalizeMonth(raw, TODAY)).toBe(expected);
    }
  );

  it('UT-130 keeps both ends of the window and rejects what lies just outside', () => {
    expect(normalizeMonth('2026-11', TODAY)).toBe('2026-11');
    expect(normalizeMonth('2025-11', TODAY)).toBe('2025-11');
    expect(normalizeMonth('2025-10', TODAY)).toBe('2026-11');
    expect(normalizeMonth('2026-12', TODAY)).toBe('2026-11');
  });

  it('UT-130 crosses the year boundary and falls back on odd shapes', () => {
    expect(normalizeMonth('2025-12', '2026-01-05')).toBe('2025-12');
    expect(normalizeMonth('2025-01', '2026-01-05')).toBe('2025-01');
    expect(normalizeMonth('2026-3', TODAY)).toBe('2026-11');
    expect(normalizeMonth('2026-00', TODAY)).toBe('2026-11');
    expect(normalizeMonth(['2026-03', '2026-04'], TODAY)).toBe('2026-11');
    expect(normalizeMonth('', TODAY)).toBe('2026-11');
  });

  it('keeps any positive whole page and sends the rest to page 1', () => {
    expect(normalizePage('3')).toBe(3);
    expect(normalizePage('1')).toBe(1);
    expect(normalizePage(undefined)).toBe(1);
    expect(normalizePage('0')).toBe(1);
    expect(normalizePage('-2')).toBe(1);
    expect(normalizePage('2.5')).toBe(1);
    expect(normalizePage('abc')).toBe(1);
    expect(normalizePage(['2', '3'])).toBe(1);
    expect(normalizePage('99999999999')).toBe(1_000_000);
  });

  it('labels a month in Portuguese', () => {
    expect(monthLabel('2026-03')).toBe('Março de 2026');
    expect(monthLabel('2025-12')).toBe('Dezembro de 2025');
    expect(monthLabel('nope')).toBe('nope');
  });

  it('lists the current month and the 12 before it, newest first', () => {
    const options = monthOptions(TODAY);

    expect(options).toHaveLength(13);
    expect(options[0]).toEqual({ value: '2026-11', label: 'Novembro de 2026' });
    expect(options[12]).toEqual({
      value: '2025-11',
      label: 'Novembro de 2025',
    });
    expect(options.map(option => option.value)).toContain('2026-01');
  });

  it('builds a panel address that leaves the first page implicit', () => {
    const path = '/restrict/financeiro';

    expect(panelHref(path, { month: '2026-03', page: 1 })).toBe(
      '/restrict/financeiro?month=2026-03'
    );
    expect(panelHref(path, { month: '2026-03', page: 4 })).toBe(
      '/restrict/financeiro?month=2026-03&page=4'
    );
  });

  it('resolves month and page of a raw address together', () => {
    expect(resolvePanelQuery({ month: '2026-03', page: '2' }, TODAY)).toEqual({
      month: '2026-03',
      page: 2,
    });
    expect(resolvePanelQuery({ month: 'x' }, TODAY)).toEqual({
      month: '2026-11',
      page: 1,
    });
  });
});
