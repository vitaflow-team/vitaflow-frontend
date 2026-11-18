import { describe, expect, it, vi } from 'vitest';
import { submitPlanAssign } from './planAssignSubmit';

const PARAMS = {
  clientId: 'cly3x8p9b0000qzrm5f1a2b3c',
  accessPlanId: 'clz9q2r8c0001abcd5f1a2b3c',
};

describe('submitPlanAssign', () => {
  it('UT-141 calls the assign action with { accessPlanId, billing: { dueDay, amountCents } }', async () => {
    const execute = vi.fn().mockResolvedValue([{ plan: { id: 'p1' } }, null]);

    const outcome = await submitPlanAssign(execute, {
      ...PARAMS,
      billing: { dueDay: 10, amountText: '149,90', cpfCnpj: '' },
    });

    expect(outcome).toEqual({ done: true });
    expect(execute).toHaveBeenCalledTimes(1);
    expect(execute).toHaveBeenCalledWith({
      clientId: PARAMS.clientId,
      accessPlanId: PARAMS.accessPlanId,
      billing: { dueDay: 10, amountCents: 14990 },
    });
  });

  it('sends a plain link when the monthly fee is off', async () => {
    const execute = vi.fn().mockResolvedValue([{}, null]);

    await submitPlanAssign(execute, { ...PARAMS, billing: null });

    expect(execute).toHaveBeenCalledWith(PARAMS);
  });

  it('does not call the action when the form is invalid, and says why', async () => {
    const execute = vi.fn();

    const outcome = await submitPlanAssign(execute, {
      ...PARAMS,
      billing: { dueDay: 10, amountText: 'abc', cpfCnpj: '' },
    });

    expect(execute).not.toHaveBeenCalled();
    expect(outcome).toMatchObject({ done: false, needsTaxId: false });
  });

  it('returns the safe message of a refused link', async () => {
    const execute = vi
      .fn()
      .mockResolvedValue([
        null,
        { message: 'Este aluno já tem cobrança recorrente.', data: 'x' },
      ]);

    const outcome = await submitPlanAssign(execute, {
      ...PARAMS,
      billing: { dueDay: 10, amountText: '120', cpfCnpj: '' },
    });

    expect(outcome).toEqual({
      done: false,
      message: 'Este aluno já tem cobrança recorrente.',
      needsTaxId: false,
    });
  });

  it('flags a missing tax ID so the form asks for it (US-012.EC-1)', async () => {
    const execute = vi.fn().mockResolvedValue([
      null,
      {
        message: 'Informe o CPF ou CNPJ do aluno.',
        data: 'tax_id_required',
      },
    ]);

    const outcome = await submitPlanAssign(execute, {
      ...PARAMS,
      billing: { dueDay: 10, amountText: '120', cpfCnpj: '' },
    });

    expect(outcome).toMatchObject({ done: false, needsTaxId: true });
  });
});
