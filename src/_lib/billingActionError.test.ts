import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { AppError } from './AppError';
import { toBillingActionError } from './billingActionError';

const RAW = 'raw-internal: relation recurring_billing_pkey sk_live_leak';

describe('toBillingActionError', () => {
  beforeEach(() => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });
  afterEach(() => vi.restoreAllMocks());

  it.each([
    [403, 'subscription_required', 'assinatura ativa da academia'],
    [403, 'not_billing_owner', 'donos de academia'],
    [403, 'manual_invoice_not_allowed', 'geradas automaticamente'],
    [403, 'student_billed_by_gym', 'cobrado pela academia'],
    [400, 'invalid_due_day', 'de 1 a 28'],
    [400, 'invalid_amount', 'fora do limite'],
    [409, 'recurring_billing_exists', 'já tem cobrança recorrente'],
    [409, 'billing_not_connected', 'Conecte a conta Asaas'],
    [409, 'billing_reconnect_needed', 'reconectada'],
    [404, 'recurring_billing_not_found', 'não tem cobrança recorrente ativa'],
    [400, 'empty_selection', 'ao menos um aluno'],
    [400, 'selection_too_large', 'no máximo 200 alunos'],
    [404, 'student_has_no_plan', 'não tem plano de acesso'],
    [404, 'access_plan_not_found', 'Plano de acesso não encontrado'],
  ])(
    'maps %s %s to Portuguese copy, never the raw message',
    (status, code, text) => {
      const error = toBillingActionError(
        'test',
        new AppError(RAW, status, code)
      );

      expect(error.message).toContain(text);
      expect(error.message).not.toContain('raw-internal');
      expect(error.data).toBe(code);
    }
  );

  it('keeps passing the backend text through for the gateway and tax ID codes, with the code attached', () => {
    const error = toBillingActionError(
      'test',
      new AppError('Informe o CPF ou CNPJ do aluno.', 400, 'tax_id_required')
    );

    expect(error.message).toBe('Informe o CPF ou CNPJ do aluno.');
    expect(error.data).toBe('tax_id_required');
  });

  it('falls back to the generic copy for an unknown code or a network failure', () => {
    const unknown = toBillingActionError(
      'test',
      new AppError(RAW, 500, 'something_else')
    );
    const network = toBillingActionError('test', new Error(RAW));

    for (const error of [unknown, network]) {
      expect(error.message).toBe(
        'Não foi possível concluir a ação. Tente novamente.'
      );
    }
  });

  it('does not map a gym code arriving with another status', () => {
    const error = toBillingActionError(
      'test',
      new AppError(RAW, 500, 'billing_not_connected')
    );

    expect(error.message).not.toContain('Conecte a conta Asaas');
  });
});
