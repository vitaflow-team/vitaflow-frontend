import { describe, expect, it } from 'vitest';
import { effectiveAccountType, RECEPTIONIST_ACCOUNT_TYPE } from './accountType';

describe('accountType — effectiveAccountType', () => {
  it('returns the synthetic RECEPTIONIST key for a receptionist login', () => {
    expect(
      effectiveAccountType({ role: 'RECEPTIONIST', productType: null })
    ).toBe(RECEPTIONIST_ACCOUNT_TYPE);
  });

  it('returns the real productType for every regular Users account', () => {
    expect(effectiveAccountType({ productType: 'ACADEMIA' })).toBe('ACADEMIA');
    expect(effectiveAccountType({ productType: 'USER' })).toBe('USER');
  });

  it('passes through a missing user as undefined', () => {
    expect(effectiveAccountType(null)).toBeUndefined();
    expect(effectiveAccountType(undefined)).toBeUndefined();
    expect(effectiveAccountType({})).toBeUndefined();
  });
});
