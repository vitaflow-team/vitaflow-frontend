import { todayInBrazil } from '@/_lib/studentsDates';
import { describe, expect, it } from 'vitest';
import {
  amountSchema,
  apiKeySchema,
  dueDateSchema,
  markPaidSchema,
  noteSchema,
  taxIdSchema,
} from './billing';

function addDays(days: number): string {
  const date = new Date(`${todayInBrazil()}T00:00:00Z`);
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
}

describe('billing schemas (UT-120)', () => {
  it('accepts Brazilian comma-decimal amount input', () => {
    const result = amountSchema.safeParse('180,00');
    expect(result.success).toBe(true);
    expect(result.success && result.data).toBe('180.00');
  });

  it('accepts dot-decimal amount input too', () => {
    expect(amountSchema.safeParse('180.00').success).toBe(true);
  });

  it('rejects an amount outside the backend limits, with a message stating the range', () => {
    const tooLow = amountSchema.safeParse('4,99');
    expect(tooLow.success).toBe(false);
    expect(tooLow.success ? '' : tooLow.error.issues[0].message).toMatch(
      /R\$ 5,00/
    );

    const tooHigh = amountSchema.safeParse('50000,01');
    expect(tooHigh.success).toBe(false);
    expect(tooHigh.success ? '' : tooHigh.error.issues[0].message).toMatch(
      /R\$ 50\.000,00/
    );
  });

  it('accepts the boundary amounts', () => {
    expect(amountSchema.safeParse('5,00').success).toBe(true);
    expect(amountSchema.safeParse('50000,00').success).toBe(true);
  });

  it('rejects a non-numeric amount with a message', () => {
    const result = amountSchema.safeParse('abc');
    expect(result.success).toBe(false);
    expect(result.success ? '' : result.error.issues[0].message).toBe(
      'Informe um valor numérico válido, por exemplo 180,00.'
    );
  });

  it('accepts a due date from today up to 90 days ahead', () => {
    expect(dueDateSchema.safeParse(todayInBrazil()).success).toBe(true);
    expect(dueDateSchema.safeParse(addDays(90)).success).toBe(true);
  });

  it('rejects a due date in the past or beyond 90 days, with a message', () => {
    const past = dueDateSchema.safeParse(addDays(-1));
    expect(past.success).toBe(false);
    expect(past.success ? '' : past.error.issues[0].message).toMatch(/90 dias/);

    expect(dueDateSchema.safeParse(addDays(91)).success).toBe(false);
  });

  it('requires the payment date and rejects a future one', () => {
    const missing = markPaidSchema.safeParse({});
    expect(missing.success).toBe(false);

    const future = markPaidSchema.safeParse({ paidOn: addDays(1) });
    expect(future.success).toBe(false);
    expect(
      future.success
        ? ''
        : future.error.issues.find(i => i.path[0] === 'paidOn')?.message
    ).toBe('A data de pagamento não pode ser no futuro.');

    expect(markPaidSchema.safeParse({ paidOn: todayInBrazil() }).success).toBe(
      true
    );
  });

  it('limits the manual note to 200 characters, with a message', () => {
    const tooLong = noteSchema.safeParse('a'.repeat(201));
    expect(tooLong.success).toBe(false);
    expect(tooLong.success ? '' : tooLong.error.issues[0].message).toBe(
      'A nota pode ter no máximo 200 caracteres.'
    );
    expect(noteSchema.safeParse('a'.repeat(200)).success).toBe(true);
    expect(noteSchema.safeParse(undefined).success).toBe(true);
  });

  it('validates the API key length, with a message', () => {
    const tooShort = apiKeySchema.safeParse('short');
    expect(tooShort.success).toBe(false);
    expect(tooShort.success ? '' : tooShort.error.issues[0].message).toMatch(
      /entre 10 e 200/
    );
    expect(apiKeySchema.safeParse('a-valid-looking-api-key-0001').success).toBe(
      true
    );
  });

  it('validates the tax number by its check digits, with a message', () => {
    const invalid = taxIdSchema.safeParse('111.111.111-11');
    expect(invalid.success).toBe(false);
    expect(invalid.success ? '' : invalid.error.issues[0].message).toBe(
      'Informe um CPF ou CNPJ válido.'
    );

    const valid = taxIdSchema.safeParse('529.982.247-25');
    expect(valid.success).toBe(true);
    expect(valid.success && valid.data).toBe('52998224725');
  });
});
