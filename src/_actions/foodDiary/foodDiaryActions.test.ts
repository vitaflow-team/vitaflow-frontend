import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const { apiClientMock, authMock } = vi.hoisted(() => ({
  apiClientMock: vi.fn(),
  authMock: vi.fn(),
}));

vi.mock('@/_lib/apiClient', () => ({ apiClient: apiClientMock }));
vi.mock('@/auth', () => ({ auth: authMock }));

import { AppError } from '@/_lib/AppError';
import { actionCompleteProfile } from './completeProfile';
import { actionDeleteMeal } from './deleteMeal';
import { actionEstimateCalories } from './estimateCalories';
import { actionLogMeal } from './logMeal';
import { actionUpdateMeal } from './updateMeal';
import { actionDecrementWater, actionIncrementWater } from './water';

const MEAL_ID = '0190aaaa-bbbb-7ccc-8ddd-eeeeffff0000';

function lastCall(): [string, RequestInit] {
  return apiClientMock.mock.calls.at(-1) as [string, RequestInit];
}

beforeEach(() => {
  apiClientMock.mockReset();
  apiClientMock.mockResolvedValue({});
  authMock.mockReset();
  authMock.mockResolvedValue({ user: { id: 'user-id' } });
  vi.spyOn(console, 'error').mockImplementation(() => {});
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe('actionEstimateCalories', () => {
  it('calls the estimate endpoint with the description', async () => {
    apiClientMock.mockResolvedValue({ calories: 300 });

    const [result, error] = await actionEstimateCalories({
      description: '1 banana',
    });

    expect(error).toBeNull();
    expect(result).toEqual({ calories: 300 });
    expect(lastCall()[0]).toBe('/food-diary/estimate-calories');
    expect(lastCall()[1].method).toBe('POST');
  });

  it('maps a 503 to the manual-fallback message (US-001.EC-3)', async () => {
    apiClientMock.mockRejectedValue(new AppError('nope', 503));

    const [, error] = await actionEstimateCalories({ description: 'x' });

    expect(error?.message).toContain('manualmente');
  });

  it('rejects an unauthenticated call before touching the backend', async () => {
    authMock.mockResolvedValue(null);

    const [, error] = await actionEstimateCalories({ description: 'x' });

    expect(error).not.toBeNull();
    expect(apiClientMock).not.toHaveBeenCalled();
  });
});

describe('actionLogMeal', () => {
  it('posts the meal as sent, not a re-fetched estimate', async () => {
    await actionLogMeal({
      mealType: 'LUNCH',
      description: 'Arroz e feijão',
      calories: 450,
    });

    expect(lastCall()[0]).toBe('/food-diary/meals');
    expect(JSON.parse(lastCall()[1].body as string)).toEqual({
      mealType: 'LUNCH',
      description: 'Arroz e feijão',
      calories: 450,
    });
  });
});

describe('actionUpdateMeal', () => {
  it('patches the meal by id with only the provided fields', async () => {
    await actionUpdateMeal({ mealId: MEAL_ID, calories: 600 });

    expect(lastCall()[0]).toBe(`/food-diary/meals/${MEAL_ID}`);
    expect(lastCall()[1].method).toBe('PATCH');
    expect(JSON.parse(lastCall()[1].body as string)).toEqual({ calories: 600 });
  });

  it('maps a 404 to a safe not-found message', async () => {
    apiClientMock.mockRejectedValue(new AppError('nope', 404));

    const [, error] = await actionUpdateMeal({
      mealId: MEAL_ID,
      calories: 600,
    });

    expect(error?.message).toContain('não encontrada');
  });
});

describe('actionDeleteMeal', () => {
  it('deletes the meal by id', async () => {
    await actionDeleteMeal({ mealId: MEAL_ID });

    expect(lastCall()[0]).toBe(`/food-diary/meals/${MEAL_ID}`);
    expect(lastCall()[1].method).toBe('DELETE');
  });
});

describe('water actions', () => {
  it('increments water for a date', async () => {
    apiClientMock.mockResolvedValue({ count: 1 });

    const [result] = await actionIncrementWater({ date: '2026-09-30' });

    expect(lastCall()[0]).toBe('/food-diary/water?date=2026-09-30');
    expect(lastCall()[1].method).toBe('POST');
    expect(result).toEqual({ count: 1 });
  });

  it('decrements water for a date', async () => {
    apiClientMock.mockResolvedValue({ count: 0 });

    const [result] = await actionDecrementWater({ date: '2026-09-30' });

    expect(lastCall()[1].method).toBe('DELETE');
    expect(result).toEqual({ count: 0 });
  });
});

describe('actionCompleteProfile', () => {
  it('submits the completed fields', async () => {
    await actionCompleteProfile({ sex: 'MALE', weightKg: 80, heightCm: 180 });

    expect(lastCall()[0]).toBe('/food-diary/profile');
    expect(JSON.parse(lastCall()[1].body as string)).toEqual({
      sex: 'MALE',
      weightKg: 80,
      heightCm: 180,
    });
  });
});
