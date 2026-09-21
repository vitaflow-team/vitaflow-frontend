import type { MeasurementRecordResponseDTO } from '@/_types/progress';
import { describe, expect, it } from 'vitest';
import {
  initialFormValues,
  latestReducer,
  type LatestState,
} from './latestRecord';

const record: MeasurementRecordResponseDTO = {
  id: 'record-id',
  weightKg: 82.4,
  heightCm: 168,
  waistCm: null,
  hipCm: null,
  recordedAt: '2026-09-15T15:00:00Z',
  bmi: 29.2,
  bmiClassification: 'SOBREPESO',
};

const loading = (token: number): LatestState => ({ status: 'loading', token });

describe('latest record', () => {
  it('UT-011 resolves, rejects and ignores stale responses', () => {
    expect(
      latestReducer(loading(1), { type: 'resolved', token: 1, record })
    ).toEqual({ status: 'ready', token: 1, record });

    expect(
      latestReducer(loading(1), { type: 'resolved', token: 1, record: null })
    ).toEqual({ status: 'ready', token: 1, record: null });

    expect(latestReducer(loading(1), { type: 'rejected', token: 1 })).toEqual({
      status: 'failed',
      token: 1,
    });

    // Resposta de uma abertura anterior não mexe no estado atual.
    const current = loading(2);
    expect(latestReducer(current, { type: 'resolved', token: 1, record })).toBe(
      current
    );
    expect(latestReducer(current, { type: 'rejected', token: 1 })).toBe(
      current
    );

    const reopened = latestReducer(
      { status: 'ready', token: 1, record },
      { type: 'reset', token: 2 }
    );
    expect(reopened).toEqual({ status: 'loading', token: 2 });
    expect(
      latestReducer(reopened, { type: 'resolved', token: 1, record })
    ).toBe(reopened);
  });

  it('UT-014 derives the initial form values from the latest record', () => {
    expect(initialFormValues(record)).toEqual({
      weightKg: '82,4',
      heightCm: '168,0',
    });

    expect(initialFormValues(null)).toEqual({ weightKg: '', heightCm: '' });
  });
});
