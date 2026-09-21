import { describe, expect, it } from 'vitest';

import { getSubscriptionPeriodEnd } from './stripePeriod';

describe('getSubscriptionPeriodEnd', () => {
  it('UT-041 converts the first subscription item period end to ISO', () => {
    expect(
      getSubscriptionPeriodEnd({
        items: { data: [{ current_period_end: 1789000000 }] },
      })
    ).toBe('2026-09-10T00:26:40.000Z');
  });

  it('UT-042 returns undefined when the first item period end is unavailable', () => {
    expect(getSubscriptionPeriodEnd({ items: { data: [] } })).toBeUndefined();
    expect(getSubscriptionPeriodEnd({ items: { data: [{}] } })).toBeUndefined();
    expect(getSubscriptionPeriodEnd({})).toBeUndefined();
  });
});
