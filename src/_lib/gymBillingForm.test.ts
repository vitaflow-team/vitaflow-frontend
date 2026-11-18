import { describe, expect, it } from 'vitest';
import {
  DUE_DAYS,
  centsToAmountInput,
  defaultDueDay,
  parseFeeAmount,
  planPriceCents,
  prepareAssign,
  prepareTermsChange,
} from './gymBillingForm';

const CLIENT = 'cly3x8p9b0000qzrm5f1a2b3c';
const PLAN = 'clz9q2r8c0001abcd5f1a2b3c';

describe('gym billing form — due day and amount', () => {
  it('UT-141 offers exactly the due days 1 to 28', () => {
    expect(DUE_DAYS).toHaveLength(28);
    expect(DUE_DAYS[0]).toBe(1);
    expect(DUE_DAYS[27]).toBe(28);
  });

  it('defaults the due day to today, capped at 28 (US-012.EC-11)', () => {
    expect(defaultDueDay('2026-11-17')).toBe(17);
    expect(defaultDueDay('2026-10-31')).toBe(28);
    expect(defaultDueDay('2026-02-28')).toBe(28);
    expect(defaultDueDay('2026-03-01')).toBe(1);
  });

  it('turns the catalog price (a decimal that may arrive as text) into cents', () => {
    expect(planPriceCents('149.90')).toBe(14990);
    expect(planPriceCents(149.9)).toBe(14990);
    expect(planPriceCents('0')).toBe(0);
  });

  it('shows cents the way the amount field takes them', () => {
    expect(centsToAmountInput(14990)).toBe('149,90');
    expect(centsToAmountInput(500)).toBe('5,00');
  });

  it('accepts the limits and refuses what is outside them', () => {
    expect(parseFeeAmount('5,00')).toEqual({ cents: 500 });
    expect(parseFeeAmount('50000')).toEqual({ cents: 5_000_000 });
    expect(parseFeeAmount('4,99')).toHaveProperty('message');
    expect(parseFeeAmount('50000,01')).toHaveProperty('message');
    expect(parseFeeAmount('0')).toHaveProperty('message');
    expect(parseFeeAmount('abc')).toHaveProperty('message');
    expect(parseFeeAmount('')).toHaveProperty('message');
  });
});

describe('prepareAssign', () => {
  it('UT-141 builds { accessPlanId, billing: { dueDay, amountCents } } from the form', () => {
    const prepared = prepareAssign({
      clientId: CLIENT,
      accessPlanId: PLAN,
      billing: { dueDay: 10, amountText: '149,90', cpfCnpj: '' },
    });

    expect(prepared).toEqual({
      ok: true,
      input: {
        clientId: CLIENT,
        accessPlanId: PLAN,
        billing: { dueDay: 10, amountCents: 14990 },
      },
    });
  });

  it('sends a plain link when the monthly fee is off', () => {
    const prepared = prepareAssign({
      clientId: CLIENT,
      accessPlanId: PLAN,
      billing: null,
    });

    expect(prepared).toEqual({
      ok: true,
      input: { clientId: CLIENT, accessPlanId: PLAN },
    });
  });

  it('adds the tax ID only when one was typed and valid', () => {
    const prepared = prepareAssign({
      clientId: CLIENT,
      accessPlanId: PLAN,
      billing: { dueDay: 5, amountText: '120', cpfCnpj: '529.982.247-25' },
    });

    expect(prepared).toEqual({
      ok: true,
      input: {
        clientId: CLIENT,
        accessPlanId: PLAN,
        billing: { dueDay: 5, amountCents: 12000, cpfCnpj: '52998224725' },
      },
    });
  });

  it('refuses an invalid tax ID and an out-of-range amount with a message', () => {
    const badTaxId = prepareAssign({
      clientId: CLIENT,
      accessPlanId: PLAN,
      billing: { dueDay: 5, amountText: '120', cpfCnpj: '123' },
    });
    const badAmount = prepareAssign({
      clientId: CLIENT,
      accessPlanId: PLAN,
      billing: { dueDay: 5, amountText: '1', cpfCnpj: '' },
    });

    expect(badTaxId).toEqual({
      ok: false,
      message: 'Informe um CPF ou CNPJ válido.',
    });
    expect(badAmount.ok).toBe(false);
  });
});

describe('prepareTermsChange', () => {
  it('needs at least one term', () => {
    const prepared = prepareTermsChange({
      clientId: CLIENT,
      dueDay: null,
      amountText: '  ',
    });

    expect(prepared.ok).toBe(false);
  });

  it('sends only what was filled in', () => {
    expect(
      prepareTermsChange({ clientId: CLIENT, dueDay: 20, amountText: '' })
    ).toEqual({ ok: true, input: { clientId: CLIENT, dueDay: 20 } });
    expect(
      prepareTermsChange({ clientId: CLIENT, dueDay: null, amountText: '120' })
    ).toEqual({ ok: true, input: { clientId: CLIENT, amountCents: 12000 } });
    expect(
      prepareTermsChange({ clientId: CLIENT, dueDay: 3, amountText: '99,90' })
    ).toEqual({
      ok: true,
      input: { clientId: CLIENT, dueDay: 3, amountCents: 9990 },
    });
  });

  it('refuses an amount outside the limits', () => {
    const prepared = prepareTermsChange({
      clientId: CLIENT,
      dueDay: null,
      amountText: '1',
    });

    expect(prepared.ok).toBe(false);
  });
});
