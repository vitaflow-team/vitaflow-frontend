import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import type { FinancialHealthSummary } from '@/_types/financialHealthSummary';
import type { FinancialPanelData } from '@/_types/financialPanelData';
import type { FinancialPanelProfile } from '@/_types/financialPanelProfile';
import { FinancialPanel } from './financialPanel';

const SUMMARY: FinancialHealthSummary = {
  audience: 'PROFESSIONAL',
  billingState: 'CONNECTED',
  hasHistory: true,
  month: '2026-03',
  current: {
    expectedCents: 60000,
    receivedCents: 10000,
    stillOwedCents: 50000,
  },
  previous: { expectedCents: 50000, receivedCents: 0, stillOwedCents: 0 },
  overdue: {
    totalCents: 70000,
    delinquentCount: 2,
    bands: { d1to7Cents: 30000, d8to30Cents: 40000, d31PlusCents: 0 },
  },
};

const DELINQUENTS = {
  items: [
    {
      clientId: 'c1',
      name: 'Ana Souza',
      totalOwedCents: 45000,
      overdueCount: 2,
      oldestDaysOverdue: 12,
    },
  ],
  page: 1,
  pageSize: 20,
  total: 1,
};

function render(
  data: Partial<FinancialPanelData>,
  profile: FinancialPanelProfile = 'PHYSICAL_EDUCATOR'
) {
  return renderToStaticMarkup(
    <FinancialPanel
      profile={profile}
      path="/restrict/financeiro"
      query={{ month: '2026-03', page: 1 }}
      today="2026-11-17"
      data={{
        summary: SUMMARY,
        delinquents: DELINQUENTS,
        canBill: null,
        ...data,
      }}
    />
  );
}

describe('FinancialPanel', () => {
  it('orders the panel as selector, month summary, overdue bands, then delinquent list', () => {
    const html = render({});
    const order = [
      'Mês</label>',
      'Resumo de Março de 2026',
      'Em atraso hoje',
      '>Inadimplentes</h2>',
    ].map(marker => html.indexOf(marker));

    expect(order.every(index => index >= 0)).toBe(true);
    expect([...order].sort((a, b) => a - b)).toEqual(order);
  });

  it('has one h1 and labels the month of the figures', () => {
    const html = render({});

    expect(html.match(/<h1/g)).toHaveLength(1);
    expect(html).toContain('>Financeiro</span>');
    expect(html).toContain('Resumo de Março de 2026');
  });

  it('shows the gym title and wording for the gym profile', () => {
    const html = render(
      { summary: { ...SUMMARY, audience: 'GYM' } },
      'ACADEMIA'
    );

    expect(html).toContain('Financeiro da academia');
    expect(html).toContain('Mensalidades em atraso');
  });

  it('replaces the whole panel with a retry message when the summary fails', () => {
    const html = render({ summary: 'failed' });

    expect(html).toContain('Não foi possível carregar o painel financeiro.');
    expect(html).toContain('Tentar novamente');
    expect(html).not.toContain('>Previsto</span>');
    expect(html).not.toContain('R$');
  });

  it('keeps the figures when only the list fails', () => {
    const html = render({ delinquents: 'failed' });

    expect(html).toContain('>Previsto</span>');
    expect(html).toContain(
      'Não foi possível carregar a lista de inadimplentes.'
    );
  });

  it('shows no figures and no list for an account that never billed', () => {
    const html = render({
      summary: { ...SUMMARY, billingState: 'NOT_CONNECTED', hasHistory: false },
    });

    expect(html).toContain('Conectar cobrança');
    expect(html).not.toContain('>Previsto</span>');
    expect(html).not.toContain('Inadimplentes');
  });
});
