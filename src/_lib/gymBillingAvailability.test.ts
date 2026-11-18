import type { BillingAccount } from '@/_types/billing';
import { describe, expect, it } from 'vitest';
import {
  availabilityHint,
  gymBillingAvailability,
} from './gymBillingAvailability';

function account(overrides: Partial<BillingAccount> = {}): BillingAccount {
  return {
    premium: true,
    connected: true,
    status: 'CONNECTED',
    accountName: 'Academia',
    openInvoiceCount: 0,
    ...overrides,
  };
}

describe('gymBillingAvailability', () => {
  it('is ready for a paid, connected account', () => {
    expect(gymBillingAvailability(account())).toBe('READY');
    expect(availabilityHint('READY')).toBeNull();
  });

  it('names what is in the way, subscription first', () => {
    expect(gymBillingAvailability(account({ premium: false }))).toBe(
      'SUBSCRIPTION_REQUIRED'
    );
    expect(
      gymBillingAvailability(
        account({ connected: false, status: 'NOT_CONNECTED' })
      )
    ).toBe('NOT_CONNECTED');
    expect(
      gymBillingAvailability(
        account({ connected: false, status: 'RECONNECT_NEEDED' })
      )
    ).toBe('RECONNECT_NEEDED');
  });

  it('never blocks when the account could not be read', () => {
    expect(gymBillingAvailability('failed')).toBe('READY');
    expect(gymBillingAvailability('forbidden')).toBe('READY');
  });

  it('explains every blocked state in Portuguese', () => {
    expect(availabilityHint('NOT_CONNECTED')).toContain('Conecte');
    expect(availabilityHint('RECONNECT_NEEDED')).toContain('reconectada');
    expect(availabilityHint('SUBSCRIPTION_REQUIRED')).toContain('assinatura');
  });
});
