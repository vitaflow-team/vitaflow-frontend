import { AppError } from '@/_lib/AppError';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const { apiClientMock, authMock, fetchPlanClaimsMock } = vi.hoisted(() => ({
  apiClientMock: vi.fn(),
  authMock: vi.fn(),
  fetchPlanClaimsMock: vi.fn(),
}));

vi.mock('@/_lib/apiClient', () => ({ apiClient: apiClientMock }));
vi.mock('@/auth', () => ({ auth: authMock }));
vi.mock('@/_lib/fetchPlanClaims', () => ({
  fetchPlanClaims: fetchPlanClaimsMock,
}));
vi.mock('next/navigation', () => ({
  redirect: vi.fn(),
  unstable_rethrow: vi.fn(),
}));

import { createAssessment } from './createAssessment';
import { createStudent } from './createStudent';
import { deleteAssessment } from './deleteAssessment';
import { deleteStudent } from './deleteStudent';
import { lookupStudentAccount } from './lookupStudentAccount';
import { updateAssessment } from './updateAssessment';
import { updateStudent } from './updateStudent';

const ID = '01890a5d-ac96-774b-bcce-b302099a8057';
const OTHER = '01890a5d-ac96-774b-bcce-b302099a8099';
const ASSESSMENT = {
  assessedOn: '2026-09-15',
  weightKg: '78,2',
  heightCm: '179',
};

const ACTIONS = [
  ['lookupStudentAccount', () => lookupStudentAccount({ email: 'a@b.com' })],
  [
    'createStudent',
    () =>
      createStudent({
        name: 'Ana',
        email: 'a@b.com',
        linkExistingAccount: false,
      }),
  ],
  ['updateStudent', () => updateStudent({ id: ID, name: 'Ana' })],
  ['deleteStudent', () => deleteStudent({ id: ID })],
  [
    'createAssessment',
    () => createAssessment({ studentId: ID, ...ASSESSMENT }),
  ],
  [
    'updateAssessment',
    () =>
      updateAssessment({ studentId: ID, assessmentId: OTHER, ...ASSESSMENT }),
  ],
  [
    'deleteAssessment',
    () => deleteAssessment({ studentId: ID, assessmentId: OTHER }),
  ],
] as const;

describe('educator student actions', () => {
  beforeEach(() => {
    apiClientMock.mockReset();
    authMock.mockReset();
    fetchPlanClaimsMock.mockReset();
    authMock.mockResolvedValue({ user: { id: 'educator-1' } });
    fetchPlanClaimsMock.mockResolvedValue({ productType: 'PHYSICAL_EDUCATOR' });
    apiClientMock.mockResolvedValue({ id: ID });
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  it.each(ACTIONS)('%s rejects a caller without a session', async (_, run) => {
    authMock.mockResolvedValue(null);

    const [, error] = await run();

    expect(error?.code).toBe('NOT_AUTHORIZED');
    expect(apiClientMock).not.toHaveBeenCalled();
  });

  it.each(ACTIONS)(
    '%s rejects a nutritionist without calling the API',
    async (_, run) => {
      fetchPlanClaimsMock.mockResolvedValue({ productType: 'NUTRITIONIST' });

      const [, error] = await run();

      expect(error?.code).toBe('NOT_AUTHORIZED');
      expect(apiClientMock).not.toHaveBeenCalled();
    }
  );

  it.each(ACTIONS)(
    '%s answers a backend failure with a generic message',
    async (_, run) => {
      apiClientMock.mockRejectedValue(new AppError('pg: secret detail', 500));

      const [, error] = await run();

      expect(error?.message).not.toContain('secret');
      expect(error?.message.length).toBeGreaterThan(0);
    }
  );

  it('UT-121 answers a throttled lookup with the wait message, never the account state', async () => {
    apiClientMock.mockRejectedValue(new AppError('Too Many Requests', 429));

    const [, error] = await lookupStudentAccount({ email: 'a@b.com' });

    expect(error?.message).toContain('Aguarde');
    expect(error?.message).not.toMatch(/conta/i);
  });

  it('UT-120 rejects a malformed e-mail before any request', async () => {
    const [, error] = await lookupStudentAccount({ email: 'sem-arroba' });

    expect(error).not.toBeNull();
    expect(apiClientMock).not.toHaveBeenCalled();
  });

  it('UT-119 reports account_exists with the holder name from the lookup', async () => {
    apiClientMock
      .mockRejectedValueOnce(new AppError('x', 409, 'account_exists'))
      .mockResolvedValueOnce({ found: true, name: 'Diego Martins' });

    const [data, error] = await createStudent({
      name: 'Diego',
      email: 'diego@exemplo.com',
      linkExistingAccount: false,
    });

    expect(error).toBeNull();
    expect(data).toEqual({
      outcome: 'account_exists',
      accountName: 'Diego Martins',
    });
  });

  it('UT-119 still reports account_exists when the name lookup fails', async () => {
    apiClientMock
      .mockRejectedValueOnce(new AppError('x', 409, 'account_exists'))
      .mockRejectedValueOnce(new AppError('x', 429));

    const [data] = await createStudent({
      name: 'Diego',
      email: 'diego@exemplo.com',
      linkExistingAccount: false,
    });

    expect(data).toEqual({ outcome: 'account_exists', accountName: null });
  });

  it('UT-122 reports student_already_registered as its own outcome', async () => {
    apiClientMock.mockRejectedValue(
      new AppError('x', 409, 'student_already_registered')
    );

    const [data] = await createStudent({
      name: 'Diego',
      email: 'diego@exemplo.com',
      linkExistingAccount: false,
    });

    expect(data).toEqual({ outcome: 'already_registered' });
  });

  it('reports a created student with its id and sends only the declared fields', async () => {
    apiClientMock.mockResolvedValue({ id: ID, name: 'Ana' });

    const [data] = await createStudent({
      name: 'Ana',
      email: 'ANA@B.com',
      linkExistingAccount: true,
    });

    expect(data).toEqual({ outcome: 'created', id: ID });
    const [path, init] = apiClientMock.mock.calls[0];
    expect(path).toBe('/educator/students');
    expect(JSON.parse(init.body)).toEqual({
      name: 'Ana',
      email: 'ana@b.com',
      linkExistingAccount: true,
    });
  });

  it('answers a self registration and an unknown account with their own messages', async () => {
    apiClientMock.mockRejectedValueOnce(
      new AppError('x', 400, 'self_registration')
    );
    const [, self] = await createStudent({
      email: 'eu@b.com',
      linkExistingAccount: true,
    });
    apiClientMock.mockRejectedValueOnce(
      new AppError('x', 404, 'account_not_found')
    );
    const [, missing] = await createStudent({
      email: 'x@b.com',
      linkExistingAccount: true,
    });

    expect(self?.message).toContain('próprio aluno');
    expect(missing?.message).toContain('Não encontramos uma conta ativa');
  });

  it('UT-140 reports declaration_required as an outcome, not an error', async () => {
    apiClientMock.mockRejectedValue(
      new AppError('x', 403, 'declaration_required')
    );

    const [data, error] = await createAssessment({
      studentId: ID,
      ...ASSESSMENT,
    });

    expect(error).toBeNull();
    expect(data).toEqual({ outcome: 'declaration_required' });
  });

  it('UT-134 sends parsed numbers and acceptDeclaration only when asked', async () => {
    apiClientMock.mockResolvedValue({ id: 'a1' });

    await createAssessment({
      studentId: ID,
      ...ASSESSMENT,
      acceptDeclaration: true,
    });

    const [path, init] = apiClientMock.mock.calls[0];
    expect(path).toBe(`/educator/students/${ID}/assessments`);
    expect(JSON.parse(init.body)).toEqual({
      assessedOn: '2026-09-15',
      weightKg: 78.2,
      heightCm: 179,
      acceptDeclaration: true,
    });
  });

  it('UT-137 answers a validation failure with a message to fix the data', async () => {
    apiClientMock.mockRejectedValue(new AppError('x', 400));

    const [, error] = await createAssessment({ studentId: ID, ...ASSESSMENT });

    expect(error?.message).toContain('Verifique os dados');
  });

  it('UT-151 treats a 404 on removing a student as already removed', async () => {
    apiClientMock.mockRejectedValue(
      new AppError('x', 404, 'student_not_found')
    );

    const [, error] = await deleteStudent({ id: ID });

    expect(error).toBeNull();
  });

  it('treats a 404 on deleting an assessment as already deleted', async () => {
    apiClientMock.mockRejectedValue(
      new AppError('x', 404, 'assessment_not_found')
    );

    const [, error] = await deleteAssessment({
      studentId: ID,
      assessmentId: OTHER,
    });

    expect(error).toBeNull();
  });

  it('still reports a failed removal that is not a 404', async () => {
    apiClientMock.mockRejectedValue(new AppError('x', 500));

    const [, error] = await deleteStudent({ id: ID });

    expect(error).not.toBeNull();
  });

  it('answers an email_locked edit with its own message', async () => {
    apiClientMock.mockRejectedValue(new AppError('x', 400, 'email_locked'));

    const [, error] = await updateStudent({ id: ID, name: 'Ana' });

    expect(error?.message).toContain('não pode ser alterado');
  });

  it('refuses an id that is not a UUID before building a path', async () => {
    const [, student] = await deleteStudent({ id: '../profile' });
    const [, assessment] = await deleteAssessment({
      studentId: ID,
      assessmentId: 'x?y=1',
    });

    expect(student?.message).toBe('Identificador inválido.');
    expect(assessment?.message).toBe('Identificador inválido.');
    expect(apiClientMock).not.toHaveBeenCalled();
  });

  it('UT-137 sends an edit as a full replace without the studentId field in the body', async () => {
    apiClientMock.mockResolvedValue({});

    await updateAssessment({
      studentId: ID,
      assessmentId: OTHER,
      ...ASSESSMENT,
    });

    const [path, init] = apiClientMock.mock.calls[0];
    expect(path).toBe(`/educator/students/${ID}/assessments/${OTHER}`);
    expect(init.method).toBe('PATCH');
    expect(JSON.parse(init.body)).not.toHaveProperty('studentId');
    expect(JSON.parse(init.body)).not.toHaveProperty('assessmentId');
  });
});
