import { describe, expect, it } from 'vitest';
import { paginationItems } from './financialPaginationItems';

function describeItems(page: number, totalPages: number): string {
  return paginationItems(page, totalPages)
    .map(item => (item.kind === 'page' ? String(item.page) : '…'))
    .join(' ');
}

describe('delinquent list pagination items', () => {
  it('links every page while there are few', () => {
    expect(describeItems(1, 1)).toBe('1');
    expect(describeItems(2, 3)).toBe('1 2 3');
    expect(describeItems(4, 7)).toBe('1 2 3 4 5 6 7');
  });

  it('keeps the first, the last and the neighbours of the current page', () => {
    expect(describeItems(1, 50)).toBe('1 2 … 50');
    expect(describeItems(25, 50)).toBe('1 … 24 25 26 … 50');
    expect(describeItems(50, 50)).toBe('1 … 49 50');
  });

  it('draws no gap between pages that are adjacent', () => {
    expect(describeItems(3, 20)).toBe('1 2 3 4 … 20');
    expect(describeItems(18, 20)).toBe('1 … 17 18 19 20');
  });
});
