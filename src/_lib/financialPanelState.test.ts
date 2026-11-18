import { describe, expect, it } from 'vitest';
import { panelStateOf, showsFigures } from './financialPanelState';

describe('financial panel state', () => {
  it.each([
    ['NOT_CONNECTED', false, null, 'EMPTY'],
    ['NOT_CONNECTED', false, false, 'EMPTY'],
    ['NOT_CONNECTED', true, null, 'HISTORY_ONLY'],
    ['NOT_CONNECTED', true, true, 'HISTORY_ONLY'],
    ['NOT_CONNECTED', true, false, 'PREMIUM_LOST'],
    ['RECONNECT_NEEDED', true, null, 'RECONNECT'],
    ['RECONNECT_NEEDED', false, null, 'RECONNECT'],
    ['CONNECTED', false, null, 'ZERO'],
    ['CONNECTED', true, null, 'READY'],
    ['CONNECTED', true, false, 'READY'],
  ] as const)(
    '%s with history=%s and canBill=%s is %s',
    (billingState, hasHistory, canBill, expected) => {
      expect(panelStateOf({ billingState, hasHistory }, canBill)).toBe(
        expected
      );
    }
  );

  it('hides the figures only in the empty state', () => {
    expect(showsFigures('EMPTY')).toBe(false);
    for (const state of [
      'RECONNECT',
      'HISTORY_ONLY',
      'PREMIUM_LOST',
      'ZERO',
      'READY',
    ] as const) {
      expect(showsFigures(state)).toBe(true);
    }
  });
});
