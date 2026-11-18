import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';

vi.mock('./connectAccountForm', () => ({
  ConnectAccountForm: ({ submitLabel }: { submitLabel: string }) => (
    <button type="button">{submitLabel}</button>
  ),
}));
vi.mock('./billingAccountCard', () => ({
  BillingAccountCard: ({ account }: { account: { accountName: string } }) => (
    <p>Conectado: {account.accountName}</p>
  ),
}));

import type { BillingAccount } from '@/_types/billing';
import { BillingSettingsPanel } from './billingSettingsPanel';

const ACCOUNT: BillingAccount = {
  premium: true,
  connected: true,
  status: 'CONNECTED',
  accountName: 'Thiago Ramos',
  openInvoiceCount: 0,
};

describe('billing settings panel', () => {
  it('UT-123 shows the Premium invitation, with no connect control, when not Premium', () => {
    const html = renderToStaticMarkup(
      <BillingSettingsPanel
        audience="PROFESSIONAL"
        account={{ ...ACCOUNT, premium: false }}
      />
    );

    expect(html).toContain('recurso Premium');
    expect(html).not.toContain('Conectar');
    expect(html).not.toContain('Thiago Ramos');
  });

  it('UT-121 shows a connect form when Premium but not connected', () => {
    const html = renderToStaticMarkup(
      <BillingSettingsPanel
        audience="PROFESSIONAL"
        account={{ ...ACCOUNT, connected: false }}
      />
    );

    expect(html).toContain('Conectar');
    expect(html).toContain('direto para a sua conta');
  });

  it('UT-121 shows the connected account, never any key', () => {
    const html = renderToStaticMarkup(
      <BillingSettingsPanel audience="PROFESSIONAL" account={ACCOUNT} />
    );

    expect(html).toContain('Conectado: Thiago Ramos');
    expect(html).not.toMatch(/sk_|api_?key/i);
  });

  it('shows a load failure message distinctly', () => {
    const html = renderToStaticMarkup(
      <BillingSettingsPanel audience="PROFESSIONAL" account="failed" />
    );

    expect(html).toContain('Tente novamente');
  });
});

describe('billing settings panel for a gym owner (ADR-008)', () => {
  it('shows the paid-subscription message, never the Premium invitation, without a paid plan', () => {
    const html = renderToStaticMarkup(
      <BillingSettingsPanel
        audience="GYM"
        account={{ ...ACCOUNT, premium: false, connected: false }}
      />
    );

    expect(html).toContain('assinatura ativa');
    expect(html).not.toContain('Premium');
    expect(html).not.toContain('Conectar');
  });

  it('offers the connect form with gym wording once the subscription is paid', () => {
    const html = renderToStaticMarkup(
      <BillingSettingsPanel
        audience="GYM"
        account={{ ...ACCOUNT, connected: false }}
      />
    );

    expect(html).toContain('Conectar');
    expect(html).toContain('conta Asaas da academia');
    expect(html).toContain('mensalidade dos alunos');
    expect(html).not.toContain('Premium');
  });

  it('shows the connected gym account like any other billing owner', () => {
    const html = renderToStaticMarkup(
      <BillingSettingsPanel audience="GYM" account={ACCOUNT} />
    );

    expect(html).toContain('Conectado: Thiago Ramos');
  });

  it('shows a load failure message distinctly', () => {
    const html = renderToStaticMarkup(
      <BillingSettingsPanel audience="GYM" account="failed" />
    );

    expect(html).toContain('Tente novamente');
  });
});
