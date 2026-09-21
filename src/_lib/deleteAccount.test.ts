import { describe, expect, it } from 'vitest';
import { isDeletionConfirmed } from './deleteAccount';

describe('account deletion', () => {
  it('UT-018 enables the deletion when the typed text is the account email', () => {
    expect(isDeletionConfirmed('ana@x.com', 'ana@x.com')).toBe(true);
  });

  it('UT-019 ignores surrounding spaces and letter case', () => {
    expect(isDeletionConfirmed('  ANA@X.COM ', 'ana@x.com')).toBe(true);
  });

  it.each([
    ['', 'empty'],
    ['ana@x.co', 'truncated'],
    ['ana@x.com.br', 'extended domain'],
    ['ana@x.com extra', 'trailing text'],
  ])('UT-020 keeps the deletion blocked for %s (%s)', typed => {
    expect(isDeletionConfirmed(typed, 'ana@x.com')).toBe(false);
  });

  it('UT-020 keeps the deletion blocked when the account email is missing', () => {
    expect(isDeletionConfirmed('', '')).toBe(false);
    expect(isDeletionConfirmed('   ', '  ')).toBe(false);
  });
});
