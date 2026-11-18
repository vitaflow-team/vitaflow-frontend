import type { EligibleStudent } from '@/_types/eligibleStudent';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { ActivationOutcome } from './activationOutcome';

const STUDENTS: EligibleStudent[] = [
  {
    clientId: 'c2',
    name: 'Bruno Lima',
    planName: 'Mensal',
    amountCents: 10000,
    hasTaxId: false,
  },
];

describe('ActivationOutcome — financial-health US-015', () => {
  it('counts the activated students and names each skipped one with the reason', () => {
    const html = renderToStaticMarkup(
      <ActivationOutcome
        students={STUDENTS}
        outcome={{
          result: {
            activated: ['c1', 'c3'],
            skipped: [{ clientId: 'c2', reason: 'tax_id_missing' }],
          },
          failure: null,
          notSent: 0,
        }}
      />
    );

    expect(html).toContain('2 aluno(s) ativado(s), 1 ignorado(s).');
    expect(html).toContain('Bruno Lima: Sem CPF ou CNPJ cadastrado');
    expect(html).not.toContain('role="alert"');
  });

  it('reports an interrupted run and how many students were not sent', () => {
    const html = renderToStaticMarkup(
      <ActivationOutcome
        students={STUDENTS}
        outcome={{
          result: { activated: ['c1'], skipped: [] },
          failure: 'Conecte a conta Asaas.',
          notSent: 250,
        }}
      />
    );

    expect(html).toContain('role="alert"');
    expect(html).toContain('Conecte a conta Asaas.');
    expect(html).toContain('250 aluno(s) não foram enviados');
  });
});
