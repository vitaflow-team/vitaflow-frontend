import type { MeasurementRecordResponseDTO } from '@/_types/progress';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const { apiClientMock, authMock } = vi.hoisted(() => ({
  apiClientMock: vi.fn(),
  authMock: vi.fn(),
}));

vi.mock('@/_lib/apiClient', () => ({ apiClient: apiClientMock }));
vi.mock('@/auth', () => ({ auth: authMock }));

import { actionGetLatestRecord } from './getLatestRecord';

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

describe('latest record action', () => {
  beforeEach(() => {
    apiClientMock.mockReset();
    authMock.mockReset();
  });

  it('UT-012 unwraps the latest record, the empty case, the missing session and a failure', async () => {
    authMock.mockResolvedValue({ user: { id: 'user-id' } });
    apiClientMock.mockResolvedValue({ latest: record });

    const [data] = await actionGetLatestRecord();

    expect(data).toEqual(record);
    expect(apiClientMock).toHaveBeenCalledWith('/progress-records/latest');

    apiClientMock.mockResolvedValue({ latest: null });
    const [empty, emptyError] = await actionGetLatestRecord();
    expect(empty).toBeNull();
    expect(emptyError).toBeNull();

    authMock.mockResolvedValue(null);
    apiClientMock.mockClear();
    const [, unauthorized] = await actionGetLatestRecord();
    expect(unauthorized?.code).toBe('NOT_AUTHORIZED');
    expect(unauthorized?.message).toBe('Usuário não autenticado.');
    expect(apiClientMock).not.toHaveBeenCalled();

    authMock.mockResolvedValue({ user: { id: 'user-id' } });
    apiClientMock.mockRejectedValue(new Error('backend fora do ar'));
    const [, failure] = await actionGetLatestRecord();
    expect(failure?.message).toBe('Erro ao carregar o último registro.');
    expect(failure?.message).not.toContain('backend');
  });
});
