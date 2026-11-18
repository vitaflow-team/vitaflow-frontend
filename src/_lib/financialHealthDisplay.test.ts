import { describe, expect, it } from 'vitest';
import {
  changeVsPrevious,
  formatBRL,
  formatChange,
  formatDays,
  monthChanges,
} from './financialHealthDisplay';

// The helper reuses Intl's pt-BR currency format, which joins "R$" and the
// number with a no-break space so the amount never splits across two lines.
const NBSP = ' ';

describe('financial health display helpers', () => {
  it.each([
    [123456, `R$${NBSP}1.234,56`],
    [0, `R$${NBSP}0,00`],
    [123456789012, `R$${NBSP}1.234.567.890,12`],
  ])('UT-131 formatBRL(%d) is %s', (cents, expected) => {
    expect(formatBRL(cents)).toBe(expected);
  });

  it('UT-131 reads as a plain "R$ 1.234,56" once the no-break space is a space', () => {
    expect(formatBRL(123456).replace(NBSP, ' ')).toBe('R$ 1.234,56');
  });

  it('changes by whole percent and never divides by zero', () => {
    expect(changeVsPrevious(12000, 10000)).toBe(20);
    expect(changeVsPrevious(9000, 10000)).toBe(-10);
    expect(changeVsPrevious(10000, 10000)).toBe(0);
    expect(changeVsPrevious(5000, 0)).toBeNull();
    expect(changeVsPrevious(0, 0)).toBeNull();
  });

  it('formats a change with its sign, or says there is no comparison', () => {
    expect(formatChange(20)).toBe('+20%');
    expect(formatChange(-10)).toBe('-10%');
    expect(formatChange(0)).toBe('0%');
    expect(formatChange(null)).toBe('Sem comparação');
  });

  it('compares each figure with its own previous-month base', () => {
    const changes = monthChanges({
      current: { expectedCents: 12000, receivedCents: 500, stillOwedCents: 0 },
      previous: { expectedCents: 10000, receivedCents: 0, stillOwedCents: 400 },
    });

    expect(changes).toEqual({ expected: 20, received: null, stillOwed: -100 });
  });

  it('pluralizes days', () => {
    expect(formatDays(1)).toBe('1 dia');
    expect(formatDays(12)).toBe('12 dias');
  });
});
