import { describe, expect, it } from 'vitest';
import { isPlatformFailure } from './isPlatformFailure';

describe('isPlatformFailure', () => {
  it('is true for every failure, including the access log one', () => {
    for (const failure of [
      'forbidden',
      'not-found',
      'failed',
      'access-log-failed',
    ]) {
      expect(isPlatformFailure(failure)).toBe(true);
    }
  });

  it('is false for data', () => {
    expect(isPlatformFailure({ tier: 'ADMIN', items: [] })).toBe(false);
    expect(isPlatformFailure(null)).toBe(false);
  });
});
