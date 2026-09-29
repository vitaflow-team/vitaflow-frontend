import { beforeEach, describe, expect, it, vi } from 'vitest';

const { apiClientMock, authMock } = vi.hoisted(() => ({
  apiClientMock: vi.fn(),
  authMock: vi.fn(),
}));

vi.mock('@/_lib/apiClient', () => ({ apiClient: apiClientMock }));
vi.mock('@/auth', () => ({ auth: authMock }));

import { AppError } from '@/_lib/AppError';
import { createMeasurementRecord } from './createMeasurementRecord';

describe('createMeasurementRecord', () => {
  beforeEach(() => {
    apiClientMock.mockReset();
    authMock.mockReset();
  });

  it('UT-044 rejects an unauthenticated request without calling the API', async () => {
    authMock.mockResolvedValue(null);

    const [, error] = await createMeasurementRecord({
      weightKg: 61.4,
      heightCm: 168,
    });

    expect(error?.message).toBe('Usuário não autenticado.');
    expect(apiClientMock).not.toHaveBeenCalled();
  });

  it('UT-045 posts the validated measurement and returns the response', async () => {
    authMock.mockResolvedValue({ user: { id: 'user-id' } });
    const response = {
      id: 'record-id',
      weightKg: 61.4,
      heightCm: 168,
      waistCm: null,
      hipCm: null,
      recordedAt: '2026-09-19T12:00:00.000Z',
      bmi: 21.8,
      bmiClassification: 'PESO_NORMAL',
    };
    apiClientMock.mockResolvedValue(response);

    const [result, error] = await createMeasurementRecord({
      weightKg: 61.4,
      heightCm: 168,
    });

    expect(apiClientMock).toHaveBeenCalledWith('/progress-records', {
      method: 'POST',
      body: JSON.stringify({ weightKg: 61.4, heightCm: 168 }),
    });
    expect(result).toEqual(response);
    expect(error).toBeNull();
  });

  it('UT-046 maps a backend validation error to a safe message', async () => {
    authMock.mockResolvedValue({ user: { id: 'user-id' } });
    apiClientMock.mockRejectedValue(
      new AppError('Peso deve ser no máximo 300.', 400)
    );

    const [, error] = await createMeasurementRecord({
      weightKg: 61.4,
      heightCm: 168,
    });

    expect(error?.message).toBe(
      'Verifique os valores informados e tente novamente.'
    );
  });
});
