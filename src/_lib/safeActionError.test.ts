import type { ErrorMapping } from '@/_types/errorMapping';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { ZSAError } from 'zsa';
import { AppError } from './AppError';
import {
  mapKnownError,
  SAFE_ACTION_FALLBACK,
  toSafeActionError,
} from './safeActionError';

const RAW = 'Prisma: relation "users" violates constraint users_email_key';

const TABLE: ErrorMapping[] = [
  { status: 402, message: 'Já existe um cliente cadastrado com este e-mail.' },
  { code: 'card_declined', message: 'Cartão recusado.' },
  { status: 400, code: 'special', message: 'Ambos.' },
];

function stripeLikeError(code: string, statusCode: number) {
  return Object.assign(new Error(RAW), { code, statusCode });
}

describe('auth input hardening — safe action errors', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('UT-009 maps a matching backend status to its safe message', () => {
    expect(mapKnownError(new AppError(RAW, 402), TABLE, 'fallback')).toBe(
      'Já existe um cliente cadastrado com este e-mail.'
    );
  });

  it('UT-009 maps a matching third-party code to its safe message', () => {
    expect(
      mapKnownError(stripeLikeError('card_declined', 402), TABLE, 'fallback')
    ).toBe('Cartão recusado.');
  });

  it('UT-009 requires both fields when an entry sets status and code', () => {
    const withCode = Object.assign(new AppError(RAW, 400), { code: 'special' });

    expect(mapKnownError(withCode, TABLE, 'fallback')).toBe('Ambos.');
    expect(mapKnownError(new AppError(RAW, 400), TABLE, 'fallback')).toBe(
      'fallback'
    );
  });

  it('UT-009 never matches a status that is not a backend AppError status', () => {
    expect(
      mapKnownError(stripeLikeError('other', 402), TABLE, 'fallback')
    ).toBe('fallback');
  });

  it.each([
    ['an unmapped AppError', new AppError(RAW, 500)],
    ['a plain Error', new Error(RAW)],
    ['a string', RAW],
    ['null', null],
  ])('UT-009 falls back for %s, never echoing the raw message', (_, error) => {
    const message = mapKnownError(error, TABLE);

    expect(message).toBe(SAFE_ACTION_FALLBACK);
    expect(message).not.toContain(RAW);
  });

  it('wraps a caught error into a safe ZSAError and logs no raw message', () => {
    const log = vi.spyOn(console, 'error').mockImplementation(() => {});

    const result = toSafeActionError(
      'someAction',
      new AppError(RAW, 402),
      TABLE
    );

    expect(result).toBeInstanceOf(ZSAError);
    expect(result.message).toBe(
      'Já existe um cliente cadastrado com este e-mail.'
    );
    expect(log).toHaveBeenCalledTimes(1);
    expect(JSON.stringify(log.mock.calls)).not.toContain(RAW);
    expect(JSON.stringify(log.mock.calls)).toContain('402');
  });

  it('passes a hand-written ZSAError through untouched', () => {
    const own = new ZSAError('FORBIDDEN', 'Mensagem segura.');

    expect(toSafeActionError('someAction', own)).toBe(own);
  });
});
