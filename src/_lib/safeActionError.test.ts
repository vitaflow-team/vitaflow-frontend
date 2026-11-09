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
    expect(mapKnownError(new AppError(RAW, 402), TABLE, 'fallback')).toEqual({
      message: 'Já existe um cliente cadastrado com este e-mail.',
      code: undefined,
    });
  });

  it('UT-009 maps a matching third-party code to its safe message', () => {
    expect(
      mapKnownError(stripeLikeError('card_declined', 402), TABLE, 'fallback')
    ).toEqual({ message: 'Cartão recusado.', code: 'card_declined' });
  });

  it('UT-009 requires both fields when an entry sets status and code', () => {
    const withCode = Object.assign(new AppError(RAW, 400), { code: 'special' });

    expect(mapKnownError(withCode, TABLE, 'fallback')).toEqual({
      message: 'Ambos.',
      code: 'special',
    });
    expect(mapKnownError(new AppError(RAW, 400), TABLE, 'fallback')).toEqual({
      message: 'fallback',
      code: undefined,
    });
  });

  it('UT-009 never matches a status that is not a backend AppError status', () => {
    expect(
      mapKnownError(stripeLikeError('other', 402), TABLE, 'fallback')
    ).toEqual({ message: 'fallback', code: undefined });
  });

  it.each([
    ['an unmapped AppError', new AppError(RAW, 500)],
    ['a plain Error', new Error(RAW)],
    ['a string', RAW],
    ['null', null],
  ])('UT-009 falls back for %s, never echoing the raw message', (_, error) => {
    const { message, code } = mapKnownError(error, TABLE);

    expect(message).toBe(SAFE_ACTION_FALLBACK);
    expect(message).not.toContain(RAW);
    expect(code).toBeUndefined();
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

  it("ADR-009 threads the matched entry's code through as the error's `data`, not its own zsa `code`", () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});

    const result = toSafeActionError(
      'someAction',
      stripeLikeError('card_declined', 402),
      TABLE
    );

    expect(result.message).toBe('Cartão recusado.');
    expect(result.data).toBe('card_declined');
    expect(result.code).toBe('ERROR');
  });

  it('ADR-009 leaves `data` unset when the matched entry (or the fallback) has no code', () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});

    const result = toSafeActionError('someAction', new AppError(RAW, 999));

    expect(result.data).toBeUndefined();
  });

  it('passes a hand-written ZSAError through untouched', () => {
    const own = new ZSAError('FORBIDDEN', 'Mensagem segura.');

    expect(toSafeActionError('someAction', own)).toBe(own);
  });

  it('platform-admin-access: shows the "ver como" read-only message for view_as_write_blocked, regardless of the action\'s own table', () => {
    const log = vi.spyOn(console, 'error').mockImplementation(() => {});
    const error = Object.assign(new AppError('ignored', 403), {
      code: 'view_as_write_blocked',
    });

    const result = toSafeActionError('anyUnrelatedAction', error, TABLE);

    expect(result.message).toContain('ver como');
    expect(result.message).toContain('somente leitura');
    log.mockRestore();
  });
});
