import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { panelCopy } from '@/_lib/financialPanelCopy';
import type { FinancialBillingState } from '@/_types/financialBillingState';
import { PanelState } from './panelState';
import { SummaryTiles } from './summaryTiles';

const ZERO = { expectedCents: 0, receivedCents: 0, stillOwedCents: 0 };
const NO_CHANGE = { expected: null, received: null, stillOwed: null };

interface Summary {
  billingState: FinancialBillingState;
  hasHistory: boolean;
}

function render(
  summary: Summary,
  canBill: boolean | null = null,
  profile: 'PHYSICAL_EDUCATOR' | 'ACADEMIA' = 'PHYSICAL_EDUCATOR'
) {
  return renderToStaticMarkup(
    <PanelState summary={summary} canBill={canBill} copy={panelCopy(profile)}>
      <SummaryTiles
        monthLabel="Março de 2026"
        current={ZERO}
        changes={NO_CHANGE}
      />
    </PanelState>
  );
}

describe('PanelState', () => {
  it('UT-135 NOT_CONNECTED with no history renders the connect action and no R$ 0,00 tiles', () => {
    const html = render({ billingState: 'NOT_CONNECTED', hasHistory: false });

    expect(html).toContain('href="/restrict/settings?tab=cobranca"');
    expect(html).toContain('Conectar cobrança');
    expect(html).not.toContain('R$');
    expect(html).not.toContain('Previsto');
  });

  it('UT-135 RECONNECT_NEEDED renders the figures plus a role="alert" reconnect notice', () => {
    const html = render({ billingState: 'RECONNECT_NEEDED', hasHistory: true });

    expect(html).toContain('role="alert"');
    expect(html).toContain('Reconecte para atualizar');
    expect(html).toContain('href="/restrict/settings?tab=cobranca"');
    expect(html).toContain('Previsto');
    expect(html).toContain('R$\u00a00,00');
  });

  it('UT-135 NOT_CONNECTED with history renders the figures plus a note', () => {
    const html = render({ billingState: 'NOT_CONNECTED', hasHistory: true });

    expect(html).toContain('role="status"');
    expect(html).toContain('A conta Asaas não está conectada');
    expect(html).toContain('cobranças já emitidas');
    expect(html).toContain('Previsto');
    expect(html).not.toContain('role="alert"');
  });

  it('keeps the figures and explains Premium when a professional lost it', () => {
    const html = render(
      { billingState: 'NOT_CONNECTED', hasHistory: true },
      false
    );

    expect(html).toContain('recurso Premium');
    expect(html).toContain('href="/restrict/settings?tab=plano"');
    expect(html).toContain('Previsto');
  });

  it('asks a gym without a paid subscription for a subscription and never mentions Premium', () => {
    const html = render(
      { billingState: 'NOT_CONNECTED', hasHistory: false },
      false,
      'ACADEMIA'
    );

    expect(html).toContain('assinatura ativa da academia');
    expect(html).not.toContain('Premium');
    expect(html).not.toContain('Previsto');
  });

  it('shows a connected panel with no invoices as real zeros with a hint', () => {
    const html = render({ billingState: 'CONNECTED', hasHistory: false });

    expect(html).toContain('Ainda não há cobranças emitidas');
    expect(html).toContain('R$\u00a00,00');
  });

  it('shows a ready panel with no notice at all', () => {
    const html = render({ billingState: 'CONNECTED', hasHistory: true });

    expect(html).not.toContain('role="alert"');
    expect(html).not.toContain('role="status"');
    expect(html).toContain('Previsto');
  });

  it('UT-139 every state carries its meaning as text, not color alone', () => {
    const states: Summary[] = [
      { billingState: 'NOT_CONNECTED', hasHistory: false },
      { billingState: 'NOT_CONNECTED', hasHistory: true },
      { billingState: 'RECONNECT_NEEDED', hasHistory: true },
      { billingState: 'CONNECTED', hasHistory: false },
    ];

    for (const summary of states) {
      const text = render(summary).replace(/<[^>]+>/g, ' ');
      expect(text.trim().length).toBeGreaterThan(30);
    }
  });
});
