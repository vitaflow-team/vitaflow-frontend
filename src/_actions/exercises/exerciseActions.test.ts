import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const { apiClientMock, authMock } = vi.hoisted(() => ({
  apiClientMock: vi.fn(),
  authMock: vi.fn(),
}));

vi.mock('@/_lib/apiClient', () => ({ apiClient: apiClientMock }));
vi.mock('@/auth', () => ({ auth: authMock }));

import { AppError } from '@/_lib/AppError';
import { SAFE_ACTION_FALLBACK } from '@/_lib/safeActionError';
import { approveExercise } from './approveExercise';
import { createExercise } from './createExercise';
import { deleteExercise } from './deleteExercise';
import { rejectExercise } from './rejectExercise';
import { submitExercise } from './submitExercise';
import { updateExercise } from './updateExercise';

const ID = '0190aaaa-bbbb-7ccc-8ddd-eeeeffff0000';

const FORM = {
  name: 'Supino reto',
  description: 'Deitado no banco, empurre a barra.',
  muscleGroup: 'Peito' as const,
  equipment: 'GYM' as const,
  contraindications: ['SHOULDER' as const],
  difficulty: '',
  imageUrl: '',
  videoUrl: 'https://youtu.be/x',
};

const BODY = {
  name: 'Supino reto',
  description: 'Deitado no banco, empurre a barra.',
  muscleGroup: 'Peito',
  equipment: 'GYM',
  contraindications: ['SHOULDER'],
  difficulty: null,
  imageUrl: null,
  videoUrl: 'https://youtu.be/x',
};

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

describe('exercise actions — requests', () => {
  it('submits an educator proposal for review', async () => {
    const [, error] = await submitExercise(FORM);

    expect(error).toBeNull();
    const [path, init] = lastCall();
    expect(path).toBe('/exercises/submissions');
    expect(init.method).toBe('POST');
    expect(JSON.parse(init.body as string)).toEqual(BODY);
  });

  it('creates and edits catalog entries directly', async () => {
    await createExercise(FORM);
    expect(lastCall()[0]).toBe('/admin/exercises');
    expect(lastCall()[1].method).toBe('POST');
    expect(JSON.parse(lastCall()[1].body as string)).toEqual(BODY);

    await updateExercise({ ...FORM, id: ID });
    expect(lastCall()[0]).toBe(`/admin/exercises/${ID}`);
    expect(lastCall()[1].method).toBe('PATCH');
    expect(JSON.parse(lastCall()[1].body as string)).toEqual(BODY);
  });

  it('removes, approves and rejects by id', async () => {
    await deleteExercise({ id: ID });
    expect(lastCall()).toEqual([
      `/admin/exercises/${ID}`,
      { method: 'DELETE' },
    ]);

    await approveExercise({ id: ID });
    expect(lastCall()).toEqual([
      `/admin/exercises/${ID}/approve`,
      { method: 'POST' },
    ]);

    await rejectExercise({ id: ID, reason: '  Duplicado  ' });
    expect(lastCall()[0]).toBe(`/admin/exercises/${ID}/reject`);
    expect(JSON.parse(lastCall()[1].body as string)).toEqual({
      reason: 'Duplicado',
    });
  });

  it('rejects without a reason when none was written (US-007.EC-2)', async () => {
    await rejectExercise({ id: ID, reason: '   ' });
    expect(JSON.parse(lastCall()[1].body as string)).toEqual({});
  });
});

describe('exercise actions — rejections', () => {
  it('refuses every action without a session, before any request', async () => {
    authMock.mockResolvedValue(null);

    const results = await Promise.all([
      submitExercise(FORM),
      createExercise(FORM),
      updateExercise({ ...FORM, id: ID }),
      deleteExercise({ id: ID }),
      approveExercise({ id: ID }),
      rejectExercise({ id: ID, reason: '' }),
    ]);

    for (const [, error] of results) expect(error?.code).toBe('NOT_AUTHORIZED');
    expect(apiClientMock).not.toHaveBeenCalled();
  });

  it('never puts a crafted id into a backend path', async () => {
    const [, error] = await deleteExercise({ id: '../profile' });

    expect(error?.message).toBe('Identificador inválido.');
    expect(apiClientMock).not.toHaveBeenCalled();
  });

  it('rejects a blank name before calling the backend (US-010.EC-3)', async () => {
    const [, error] = await updateExercise({ ...FORM, id: ID, name: ' ' });

    expect(error).not.toBeNull();
    expect(apiClientMock).not.toHaveBeenCalled();
  });

  it('flags a double submission (US-006.EC-3)', async () => {
    apiClientMock.mockRejectedValue(new AppError('duplicate', 409));
    const [, error] = await submitExercise(FORM);
    expect(error?.message).toBe(
      'Você acabou de enviar este mesmo exercício. Ele já está aguardando revisão.'
    );
  });

  it('explains a submission from a non-educator account', async () => {
    apiClientMock.mockRejectedValue(new AppError('raw', 403));
    const [, error] = await submitExercise(FORM);
    expect(error?.message).toBe(
      'Apenas educadores físicos podem sugerir exercícios.'
    );
  });

  it('reports a submission another reviewer already decided (US-008.EC-2)', async () => {
    apiClientMock.mockRejectedValue(
      new AppError('Exercício já está aprovado.', 409)
    );

    const [, approveError] = await approveExercise({ id: ID });
    const [, rejectError] = await rejectExercise({ id: ID, reason: '' });

    const message = 'Esta sugestão já foi revisada por outra pessoa da equipe.';
    expect(approveError?.message).toBe(message);
    expect(rejectError?.message).toBe(message);
  });

  it('refuses a backoffice action from a non-staff account', async () => {
    apiClientMock.mockRejectedValue(new AppError('raw', 403));
    const [, error] = await createExercise(FORM);
    expect(error?.message).toBe('Ação restrita à equipe Vita Flow.');
  });

  it('never leaks an unexpected backend message', async () => {
    apiClientMock.mockRejectedValue(new AppError('stack trace here', 500));
    const [, error] = await deleteExercise({ id: ID });
    expect(error?.message).toBe(SAFE_ACTION_FALLBACK);
  });
});
