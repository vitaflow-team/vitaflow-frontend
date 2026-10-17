import { describe, expect, it } from 'vitest';
import type { FormRecord, TemplateField } from '@/_types/clinicalRecords';
import {
  buildValueInputs,
  missingRequiredField,
  prefillAnswers,
} from './formRecordValues';

function field(overrides: Partial<TemplateField> = {}): TemplateField {
  return {
    id: 'field-1',
    position: 0,
    label: 'Peso (kg)',
    fieldType: 'NUMBER',
    options: [],
    required: false,
    weightRole: false,
    heightRole: false,
    ...overrides,
  };
}

describe('buildValueInputs', () => {
  it('includes only the answered fields, by field id', () => {
    const fields = [field({ id: 'a' }), field({ id: 'b', label: 'Altura' })];
    const inputs = buildValueInputs(fields, { a: 80, b: undefined });

    expect(inputs).toEqual([{ templateFieldId: 'a', value: 80 }]);
  });

  it('treats an empty string the same as unanswered', () => {
    const inputs = buildValueInputs([field()], { 'field-1': '' });
    expect(inputs).toEqual([]);
  });
});

describe('missingRequiredField', () => {
  it('names the first required field left unanswered', () => {
    const fields = [
      field({ id: 'a', label: 'Peso', required: true }),
      field({ id: 'b', label: 'Altura', required: true }),
    ];
    expect(missingRequiredField(fields, { a: 80 })).toBe('Altura');
  });

  it('is null when every required field is answered', () => {
    const fields = [field({ id: 'a', required: true })];
    expect(missingRequiredField(fields, { a: 80 })).toBeNull();
  });

  it('never flags an optional field', () => {
    const fields = [field({ id: 'a', required: false })];
    expect(missingRequiredField(fields, {})).toBeNull();
  });
});

describe('prefillAnswers', () => {
  function record(): FormRecord {
    return {
      id: 'record-1',
      recordedAt: '2026-10-01T12:00:00.000Z',
      recordedByUserId: 'nutri-1',
      values: [
        {
          fieldLabel: 'Peso (kg)',
          fieldType: 'NUMBER',
          value: 80,
          weightRole: true,
          heightRole: false,
        },
      ],
      bmi: null,
    };
  }

  it('matches an existing record by field label', () => {
    const fields = [field({ id: 'field-1', label: 'Peso (kg)' })];
    expect(prefillAnswers(fields, record())).toEqual({ 'field-1': 80 });
  });

  it('leaves a field blank when no past value shares its label', () => {
    const fields = [field({ id: 'field-1', label: 'Circunferência' })];
    expect(prefillAnswers(fields, record())).toEqual({});
  });

  it('is empty when there is no existing record', () => {
    const fields = [field()];
    expect(prefillAnswers(fields, null)).toEqual({});
  });
});
