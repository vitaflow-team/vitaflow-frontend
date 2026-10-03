import { ASSESSMENT_FIELDS } from '@/_constants/assessmentFields';
import { todayInBrazil } from '@/_lib/studentsDates';
import { describe, expect, it } from 'vitest';
import { assessmentSchema } from './assessment';

const VALID = {
  assessedOn: todayInBrazil(),
  weightKg: '78,2',
  heightCm: '179',
};

function messagesFor(input: Record<string, unknown>, field: string): string[] {
  const result = assessmentSchema.safeParse(input);
  if (result.success) return [];

  return result.error.issues
    .filter(issue => issue.path[0] === field)
    .map(issue => issue.message);
}

describe('assessment schema', () => {
  it('UT-103 parses a decimal comma and rejects a thousands separator', () => {
    const parsed = assessmentSchema.parse(VALID);

    expect(parsed.weightKg).toBe(78.2);
    expect(messagesFor({ ...VALID, weightKg: '1.234,5' }, 'weightKg')).toEqual([
      'Peso deve ser um número válido.',
    ]);
  });

  it('UT-104 parses a decimal dot and rejects a second decimal place', () => {
    expect(
      assessmentSchema.parse({ ...VALID, weightKg: '78.2' }).weightKg
    ).toBe(78.2);
    expect(messagesFor({ ...VALID, weightKg: '78.25' }, 'weightKg')).toEqual([
      'Peso deve ter no máximo uma casa decimal.',
    ]);
  });

  it.each(ASSESSMENT_FIELDS)(
    'UT-105 $name states its allowed range when out of range',
    ({ name, min, max, label }) => {
      for (const outside of [min - 1, max + 1]) {
        const [message] = messagesFor(
          { ...VALID, [name]: String(outside) },
          name
        );

        expect(message).toContain(label);
        expect(message).toContain(`entre ${min} e ${max}`);
      }
      expect(messagesFor({ ...VALID, [name]: String(min) }, name)).toEqual([]);
      expect(messagesFor({ ...VALID, [name]: String(max) }, name)).toEqual([]);
    }
  );

  it('UT-106 asks for date, weight and height when they are empty', () => {
    expect(messagesFor({ ...VALID, assessedOn: '' }, 'assessedOn')).toContain(
      'A data é obrigatória.'
    );
    expect(messagesFor({ ...VALID, weightKg: '' }, 'weightKg')).toEqual([
      'Peso é obrigatório.',
    ]);
    expect(messagesFor({ ...VALID, heightCm: '  ' }, 'heightCm')).toEqual([
      'Altura é obrigatória.',
    ]);
  });

  it('accepts the optional values left empty and drops them', () => {
    const parsed = assessmentSchema.parse({
      ...VALID,
      bodyFatPercent: '',
      armCm: '  ',
    });

    expect(parsed.bodyFatPercent).toBeUndefined();
    expect(parsed.armCm).toBeUndefined();
  });

  it('accepts a negative flexibility and a whole heart rate only', () => {
    expect(
      assessmentSchema.parse({ ...VALID, flexibilityCm: '-12,5' }).flexibilityCm
    ).toBe(-12.5);
    expect(
      messagesFor({ ...VALID, restingHeartRate: '60,5' }, 'restingHeartRate')
    ).not.toEqual([]);
    expect(
      assessmentSchema.parse({ ...VALID, restingHeartRate: '58' })
        .restingHeartRate
    ).toBe(58);
  });

  it.each(['9'.repeat(400), '1e3', '0x10', 'abc', '1,2,3'])(
    'UT-107 rejects the numeric text %#',
    text => {
      expect(messagesFor({ ...VALID, weightKg: text }, 'weightKg')).toEqual([
        'Peso deve ser um número válido.',
      ]);
    }
  );

  it('UT-108 accepts today and rejects tomorrow and impossible dates', () => {
    expect(messagesFor(VALID, 'assessedOn')).toEqual([]);

    const tomorrow = new Date(`${todayInBrazil()}T00:00:00.000Z`);
    tomorrow.setUTCDate(tomorrow.getUTCDate() + 1);
    expect(
      messagesFor(
        { ...VALID, assessedOn: tomorrow.toISOString().slice(0, 10) },
        'assessedOn'
      )
    ).toContain('A data não pode ser futura.');
    expect(
      messagesFor({ ...VALID, assessedOn: '2026-02-30' }, 'assessedOn')
    ).toContain('Data inválida.');
  });
});
