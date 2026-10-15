import { describe, expect, it } from 'vitest';
import { accessPlanSchema, inviteAcademiaMemberSchema } from './academia';

describe('inviteAcademiaMemberSchema — gym-foundation US-003, US-006', () => {
  it('normalizes the e-mail to lower case', () => {
    const result = inviteAcademiaMemberSchema.parse({
      email: 'Educador@Exemplo.COM',
      kind: 'EMPLOYMENT',
    });
    expect(result.email).toBe('educador@exemplo.com');
  });

  it('rejects an empty or invalid e-mail', () => {
    expect(
      inviteAcademiaMemberSchema.safeParse({ email: '', kind: 'EMPLOYMENT' })
        .success
    ).toBe(false);
    expect(
      inviteAcademiaMemberSchema.safeParse({
        email: 'not-an-email',
        kind: 'RECEPTIONIST',
      }).success
    ).toBe(false);
  });
});

describe('accessPlanSchema — gym-foundation US-018, US-019', () => {
  it('accepts a DAYS plan and coerces numeric string inputs', () => {
    const result = accessPlanSchema.parse({
      name: 'Mensal',
      validityType: 'DAYS',
      validityValue: '30',
      referencePrice: '129.9',
    });
    expect(result).toEqual({
      name: 'Mensal',
      validityType: 'DAYS',
      validityValue: 30,
      referencePrice: 129.9,
    });
  });

  it('rejects an empty name', () => {
    expect(
      accessPlanSchema.safeParse({
        name: '   ',
        validityType: 'DAYS',
        validityValue: 30,
        referencePrice: 10,
      }).success
    ).toBe(false);
  });

  it('rejects a zero or negative validityValue', () => {
    expect(
      accessPlanSchema.safeParse({
        name: 'Plano',
        validityType: 'VISITS',
        validityValue: 0,
        referencePrice: 10,
      }).success
    ).toBe(false);
    expect(
      accessPlanSchema.safeParse({
        name: 'Plano',
        validityType: 'VISITS',
        validityValue: -1,
        referencePrice: 10,
      }).success
    ).toBe(false);
  });

  it('rejects a negative referencePrice but allows zero', () => {
    expect(
      accessPlanSchema.safeParse({
        name: 'Plano',
        validityType: 'DAYS',
        validityValue: 10,
        referencePrice: -1,
      }).success
    ).toBe(false);
    expect(
      accessPlanSchema.safeParse({
        name: 'Plano',
        validityType: 'DAYS',
        validityValue: 10,
        referencePrice: 0,
      }).success
    ).toBe(true);
  });
});
