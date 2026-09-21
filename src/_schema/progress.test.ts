import { describe, expect, it } from 'vitest';
import { measurementRecordSchema } from './progress';

function issueMessage(
  input: Record<string, unknown>,
  field: 'weightKg' | 'heightCm' | 'waistCm' | 'hipCm'
) {
  const result = measurementRecordSchema.safeParse(input);
  expect(result.success).toBe(false);
  if (result.success) return undefined;
  return result.error.issues.find(issue => issue.path[0] === field)?.message;
}

describe('measurement record decimal schema', () => {
  it('UT-038 parses comma input and rejects excess decimal places', () => {
    expect(
      measurementRecordSchema.parse({ weightKg: '62,5', heightCm: '172' })
    ).toEqual({ weightKg: 62.5, heightCm: 172 });
    expect(
      measurementRecordSchema.parse({ weightKg: '62.5', heightCm: '172' })
    ).toEqual({ weightKg: 62.5, heightCm: 172 });
    expect(
      issueMessage({ weightKg: '62,55', heightCm: '172' }, 'weightKg')
    ).toBe('Peso deve ter no máximo uma casa decimal.');
  });

  it('UT-039 preserves invalid, range and required messages', () => {
    expect(issueMessage({ weightKg: 'abc', heightCm: '172' }, 'weightKg')).toBe(
      'Peso deve ser um número válido.'
    );
    expect(issueMessage({ weightKg: '19', heightCm: '172' }, 'weightKg')).toBe(
      'Peso deve ser no mínimo 20.'
    );
    expect(issueMessage({ weightKg: '301', heightCm: '172' }, 'weightKg')).toBe(
      'Peso deve ser no máximo 300.'
    );
    expect(issueMessage({ weightKg: '', heightCm: '172' }, 'weightKg')).toBe(
      'Peso deve ser um número válido.'
    );
  });

  it('UT-040 accepts a blank optional field and validates a filled one', () => {
    expect(
      measurementRecordSchema.parse({
        weightKg: '62,5',
        heightCm: '172',
        waistCm: '',
      })
    ).toEqual({ weightKg: 62.5, heightCm: 172, waistCm: undefined });
    expect(
      issueMessage(
        { weightKg: '62,5', heightCm: '172', waistCm: '500' },
        'waistCm'
      )
    ).toBe('Cintura deve ser no máximo 200.');
  });

  it('UT-041 continues to accept server-action numeric input', () => {
    expect(
      measurementRecordSchema.parse({ weightKg: 62.5, heightCm: 172 })
    ).toEqual({ weightKg: 62.5, heightCm: 172 });
  });
});
