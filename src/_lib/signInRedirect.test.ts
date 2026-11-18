import { beforeEach, describe, expect, it, vi } from 'vitest';

const { redirectMock } = vi.hoisted(() => ({
  redirectMock: vi.fn((): never => {
    throw new Error('NEXT_REDIRECT');
  }),
}));

vi.mock('next/navigation', () => ({ redirect: redirectMock }));

import { redirectToSignIn, signInPathFor } from './signInRedirect';

describe('sign-in redirect', () => {
  beforeEach(() => {
    redirectMock.mockClear();
  });

  it('keeps the path to come back to as the callback', () => {
    expect(signInPathFor('/restrict/financeiro')).toBe(
      '/signin?callbackUrl=%2Frestrict%2Ffinanceiro'
    );
  });

  it('redirects to the sign-in address and aborts rendering', () => {
    expect(() => redirectToSignIn('/restrict/academia-financeiro')).toThrow(
      'NEXT_REDIRECT'
    );
    expect(redirectMock).toHaveBeenCalledWith(
      '/signin?callbackUrl=%2Frestrict%2Facademia-financeiro'
    );
  });
});
