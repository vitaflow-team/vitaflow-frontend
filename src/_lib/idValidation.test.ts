import { describe, expect, it } from 'vitest';
import { ZSAError } from 'zsa';
import { parseBackendId } from './idValidation';

const VALID_ID = '0199a1b2-7c3d-7e4f-8a9b-0c1d2e3f4a5b';

describe('parseBackendId — backend path ids are validated', () => {
  it('UT-012 returns a valid UUID unchanged', () => {
    expect(parseBackendId(VALID_ID)).toBe(VALID_ID);
  });

  it.each([
    '../profile',
    '',
    '123',
    '   ',
    `${VALID_ID}/../../users`,
    '..%2Fprofile',
    `${VALID_ID}?admin=true`,
  ])('UT-013 rejects %j', id => {
    expect(() => parseBackendId(id)).toThrow(ZSAError);
    expect(() => parseBackendId(id)).toThrow('Identificador inválido.');
  });
});
