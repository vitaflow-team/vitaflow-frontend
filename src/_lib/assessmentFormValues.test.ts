import type { Assessment } from '@/_types/students';
import { describe, expect, it } from 'vitest';
import { decideClose, getAssessmentDefaults } from './assessmentFormValues';

const SAVED: Assessment = {
  id: 'a1',
  studentId: 's1',
  assessedOn: '2026-09-15',
  weightKg: 78.2,
  heightCm: 179,
  bodyFatPercent: 18.4,
  restingHeartRate: null,
  flexibilityCm: -3.5,
  armCm: null,
  chestCm: null,
  waistCm: 82,
  abdomenCm: null,
  hipCm: null,
  thighCm: null,
  calfCm: null,
  createdAt: '2026-09-15T15:00:00.000Z',
};

describe('assessment form values', () => {
  it('UT-132 opens a new form with today and the previous height', () => {
    const values = getAssessmentDefaults({
      previous: SAVED,
      today: '2026-10-03',
    });

    expect(values.assessedOn).toBe('2026-10-03');
    expect(values.heightCm).toBe('179');
    expect(values.weightKg).toBe('');
    expect(values.bodyFatPercent).toBe('');
  });

  it('opens the very first form with today and no height', () => {
    const values = getAssessmentDefaults({
      previous: null,
      today: '2026-10-03',
    });

    expect(values.heightCm).toBe('');
  });

  it('UT-144 opens an edit with the saved values, decimal comma, blanks for missing', () => {
    const values = getAssessmentDefaults({
      existing: SAVED,
      today: '2026-10-03',
    });

    expect(values.assessedOn).toBe('2026-09-15');
    expect(values.weightKg).toBe('78,2');
    expect(values.flexibilityCm).toBe('-3,5');
    expect(values.waistCm).toBe('82');
    expect(values.armCm).toBe('');
  });

  it('UT-138 asks before closing with typed values, not without', () => {
    expect(decideClose({ isDirty: true, isPending: false })).toBe('confirm');
    expect(decideClose({ isDirty: false, isPending: false })).toBe('close');
  });

  it('keeps the form open while a save is in flight', () => {
    expect(decideClose({ isDirty: true, isPending: true })).toBe('stay');
    expect(decideClose({ isDirty: false, isPending: true })).toBe('stay');
  });
});
