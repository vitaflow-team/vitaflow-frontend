import type { PlatformDelinquentsPage } from '@/_types/platformDelinquentsPage';
import type { PlatformFinancialData } from '@/_types/platformFinancialData';
import type { PlatformSummary } from '@/_types/platformSummary';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { PlatformFinancialPanel } from './platformFinancialPanel';

const PATH = '/restrict/backoffice/financial-health';
const QUERY = { month: '2026-11', page: 1 };
const ZERO = { expectedCents: 0, receivedCents: 0, stillOwedCents: 0 };
const NO_OVERDUE = {
  totalCents: 0,
  delinquentCount: 0,
  bands: { d1to7Cents: 0, d8to30Cents: 0, d31PlusCents: 0 },
};

const SUMMARY: PlatformSummary = {
  month: '2026-11',
  available: true,
  syncedAt: null,
  totals: { expectedCents: 24980, receivedCents: 14990, stillOwedCents: 9990 },
  byAccountType: {
    USER: ZERO,
    NUTRITIONIST: ZERO,
    PHYSICAL_EDUCATOR: ZERO,
    ACADEMIA: ZERO,
  },
  previous: null,
  overdue: {
    totalCents: 9990,
    delinquentCount: 1,
    bands: { d1to7Cents: 9990, d8to30Cents: 0, d31PlusCents: 0 },
    byAccountType: {
      USER: NO_OVERDUE,
      NUTRITIONIST: NO_OVERDUE,
      PHYSICAL_EDUCATOR: NO_OVERDUE,
      ACADEMIA: NO_OVERDUE,
    },
  },
};

function page(tier: 'ADMIN' | 'EQUIPE'): PlatformDelinquentsPage {
  return {
    tier,
    bandCounts: { d1to7: 3, d8to30: 2, d31Plus: 1 },
    items: [
      {
        userId: 'u1',
        name: 'Ana Souza',
        accountType: 'USER',
        planName: 'Premium',
        totalOwedCents: 9990,
        oldestDaysOverdue: 12,
      },
    ],
    page: 1,
    pageSize: 20,
    total: 1,
  };
}

function render(data: PlatformFinancialData) {
  return renderToStaticMarkup(
    <PlatformFinancialPanel
      path={PATH}
      query={QUERY}
      today="2026-11-17"
      data={data}
    />
  );
}

describe('PlatformFinancialPanel — financial-health US-021 to US-025', () => {
  it('UT-137 tier EQUIPE renders the list and the band counts and no revenue totals', () => {
    const html = render({ delinquents: page('EQUIPE'), summary: null });

    expect(html).toContain('Ana Souza');
    expect(html).toContain('Inadimplentes por faixa de atraso');
    expect(html).toContain('1–7 dias');
    expect(html).not.toContain('Recebido');
    expect(html).not.toContain('Previsto');
    expect(html).not.toContain('Falta receber');
    expect(html).not.toContain('id="financial-month"');
  });

  it('UT-137 tier ADMIN renders the totals, the selector, the bands and the list', () => {
    const html = render({ delinquents: page('ADMIN'), summary: SUMMARY });

    expect(html).toContain('Recebido');
    expect(html).toContain('Previsto');
    expect(html).toMatch(/R\$\s249,80/);
    expect(html).toContain('id="financial-month"');
    expect(html).toContain('Inadimplentes por faixa de atraso');
    expect(html).toContain('Ana Souza');
  });

  it('UT-137 never shows the word "Recebido" to the EQUIPE tier, in any text of the page', () => {
    const html = render({ delinquents: page('EQUIPE'), summary: null });

    expect(html.toLowerCase()).not.toContain('recebido');
  });

  it('UT-124 says what each tier is looking at', () => {
    expect(render({ delinquents: page('EQUIPE'), summary: null })).toContain(
      'Assinantes inadimplentes da Vita Flow'
    );
    expect(render({ delinquents: page('ADMIN'), summary: SUMMARY })).toContain(
      'Não inclui o que os profissionais cobram'
    );
  });

  it('shows the dedicated state, and no list or counts, when the access could not be logged', () => {
    const html = render({ delinquents: 'access-log-failed', summary: null });

    expect(html).toContain('Não foi possível registrar o seu acesso');
    expect(html).not.toContain('Ana Souza');
    expect(html).not.toContain('faixa de atraso');
    expect(html).not.toContain('<table');
  });

  it('renders access denied for a 403 on the list', () => {
    const html = render({ delinquents: 'forbidden', summary: null });

    expect(html).toContain('Você não tem acesso a esta área.');
    expect(html).not.toContain('Ana Souza');
  });

  it('keeps the list when the ADMIN summary fails on its own', () => {
    const html = render({ delinquents: page('ADMIN'), summary: 'failed' });

    expect(html).toContain('Não foi possível carregar o resumo financeiro');
    expect(html).toContain('Ana Souza');
  });

  it('has a single level-one heading', () => {
    const html = render({ delinquents: page('EQUIPE'), summary: null });

    expect(html.match(/<h1/g)).toHaveLength(1);
    expect(html).toContain('Saúde financeira da plataforma');
  });
});
