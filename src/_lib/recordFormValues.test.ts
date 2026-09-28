import {
  finiteDecimal,
  firstInvalidRecordField,
  getRecordFormDefaults,
} from '@/_lib/recordFormValues';
import type { MeasurementRecordResponseDTO } from '@/_types/progress';
import { describe, expect, it } from 'vitest';

const LATEST: MeasurementRecordResponseDTO = {
  id: 'rec-1',
  weightKg: 82.4,
  heightCm: 168,
  waistCm: null,
  hipCm: null,
  recordedAt: '2026-09-15T15:00:00Z',
  bmi: 29.2,
  bmiClassification: 'SOBREPESO',
};

describe('refactor — recordFormValues', () => {
  // UT-001
  it('parses comma decimals and rejects non-numbers', () => {
    expect(finiteDecimal('82,4')).toBe(82.4);
    expect(finiteDecimal('')).toBeUndefined();
    expect(finiteDecimal('abc')).toBeUndefined();
  });

  // UT-001
  it('uses the edited record values, optional fields included', () => {
    const defaults = getRecordFormDefaults({
      latest: LATEST,
      existingRecord: { ...LATEST, weightKg: 79.5, waistCm: 80 },
    });

    expect(defaults).toEqual({
      weightKg: '79,5',
      heightCm: '168,0',
      waistCm: '80,0',
      hipCm: '',
    });
  });

  // UT-005
  it('prefills a new record from the latest one, or leaves it empty', () => {
    expect(getRecordFormDefaults({ latest: LATEST })).toEqual({
      weightKg: '82,4',
      heightCm: '168,0',
      waistCm: '',
      hipCm: '',
    });
    expect(getRecordFormDefaults({ latest: null })).toEqual({
      weightKg: '',
      heightCm: '',
      waistCm: '',
      hipCm: '',
    });
  });

  // UT-001
  it('picks the first invalid field in visual order', () => {
    const error = { type: 'custom', message: 'x' };

    expect(firstInvalidRecordField({ hipCm: error, heightCm: error })).toBe(
      'heightCm'
    );
    expect(firstInvalidRecordField({ waistCm: error })).toBe('waistCm');
    expect(firstInvalidRecordField({})).toBeUndefined();
  });
});
