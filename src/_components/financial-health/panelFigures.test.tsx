import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { panelCopy } from '@/_lib/financialPanelCopy';
import type { FinancialHealthSummary } from '@/_types/financialHealthSummary';
import { PanelFigures } from './panelFigures';

const SUMMARY: FinancialHealthSummary = {
  audience: 'PROFESSIONAL',
  billingState: 'CONNECTED',
  hasHistory: true,
  month: '2026-03',
  current: { expectedCents: 60000, receivedCents: 0, stillOwedCents: 60000 },
  previous: { expectedCents: 50000, receivedCents: 0, stillOwedCents: 0 },
  overdue: {
    totalCents: 0,
    delinquentCount: 0,
    bands: { d1to7Cents: 0, d8to30Cents: 0, d31PlusCents: 0 },
  },
};

function render() {
  return renderToStaticMarkup(
    <PanelFigures
      summary={SUMMARY}
      delinquents={{ items: [], page: 1, pageSize: 20, total: 0 }}
      profile="PHYSICAL_EDUCATOR"
      copy={panelCopy('PHYSICAL_EDUCATOR')}
      path="/restrict/financeiro"
      query={{ month: '2026-03', page: 1 }}
      today="2026-11-17"
    />
  );
}

describe('PanelFigures', () => {
  it('selects the month of the figures and compares each against its own base', () => {
    const html = render();

    expect(html).toMatch(/<option value="2026-03" selected/);
    expect(html).toContain('Resumo de Março de 2026');
    expect(html).toContain('+20% em relação ao mês anterior');
    expect(html).toContain('Sem comparação');
  });

  it('shows the overdue bands and the empty delinquent list below the summary', () => {
    const html = render();

    expect(html.indexOf('Em atraso hoje')).toBeGreaterThan(
      html.indexOf('Resumo de')
    );
    expect(html).toContain(panelCopy('PHYSICAL_EDUCATOR').noOverdue);
    expect(html).toContain(panelCopy('PHYSICAL_EDUCATOR').emptyDelinquents);
  });
});
