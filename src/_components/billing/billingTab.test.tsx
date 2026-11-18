import type { InvoiceList as InvoiceListType } from '@/_types/billing';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';

vi.mock('./invoiceGenerationPanel', () => ({
  InvoiceGenerationPanel: () => <p>painel de geração</p>,
}));
vi.mock('./invoiceList', () => ({
  InvoiceList: ({
    items,
    allowEdit,
  }: {
    items: unknown[];
    allowEdit?: boolean;
  }) => (
    <p>
      lista-mock:{items.length}:{String(allowEdit)}
    </p>
  ),
}));
vi.mock('./taxIdSection', () => ({ TaxIdSection: () => null }));

import { BillingTab } from './billingTab';

const BASE: InvoiceListType = {
  items: [],
  total: 0,
  page: 1,
  pageSize: 20,
  situation: 'NONE',
  taxId: { present: false, masked: null },
  gateway: { connected: true, premium: true },
};

describe('billing tab', () => {
  it('UT-128, UT-129 (EC-2) shows the Premium invitation and no controls when not Premium', () => {
    const html = renderToStaticMarkup(
      <BillingTab
        clientId="c1"
        basePath="/x"
        invoices={{ ...BASE, gateway: { connected: true, premium: false } }}
      />
    );

    expect(html).not.toContain('painel de geração');
    expect(html).not.toContain('lista-mock');
  });

  it('UT-128 shows the situation and the list, with the generation panel, when connected', () => {
    const html = renderToStaticMarkup(
      <BillingTab clientId="c1" basePath="/x" invoices={BASE} />
    );

    expect(html).toContain('Sem cobrança');
    expect(html).toContain('painel de geração');
    expect(html).toContain('lista-mock');
  });

  it('UT-003.EC-4 hides the generation panel, but keeps the list, when not connected', () => {
    const html = renderToStaticMarkup(
      <BillingTab
        clientId="c1"
        basePath="/x"
        invoices={{ ...BASE, gateway: { connected: false, premium: true } }}
      />
    );

    expect(html).not.toContain('painel de geração');
    expect(html).toContain('Conecte sua conta Asaas');
    expect(html).toContain('lista-mock');
  });

  it('shows a not-found message for a removed student', () => {
    const html = renderToStaticMarkup(
      <BillingTab clientId="c1" basePath="/x" invoices="not-found" />
    );

    expect(html).toContain('Aluno não encontrado');
  });

  it('financial-health: a gym owner without a paid subscription sees the subscription message, not Premium', () => {
    const html = renderToStaticMarkup(
      <BillingTab
        clientId="c1"
        basePath="/x"
        audience="GYM"
        invoices={{ ...BASE, gateway: { connected: true, premium: false } }}
      />
    );

    expect(html).toContain('exige uma assinatura ativa');
    expect(html).not.toContain('Premium');
    expect(html).not.toContain('painel de geração');
    expect(html).not.toContain('lista-mock');
  });

  it('financial-health: a gym owner gets the fee list without the manual generation panel or editing', () => {
    const html = renderToStaticMarkup(
      <BillingTab clientId="c1" basePath="/x" audience="GYM" invoices={BASE} />
    );

    expect(html).toContain('lista-mock:0:false');
    expect(html).not.toContain('painel de geração');
  });

  it('financial-health: a professional keeps the generation panel and editing', () => {
    const html = renderToStaticMarkup(
      <BillingTab clientId="c1" basePath="/x" invoices={BASE} />
    );

    expect(html).toContain('painel de geração');
    expect(html).toContain('lista-mock:0:true');
  });

  it('financial-health: a gym owner not connected is told to connect the gym account', () => {
    const html = renderToStaticMarkup(
      <BillingTab
        clientId="c1"
        basePath="/x"
        audience="GYM"
        invoices={{ ...BASE, gateway: { connected: false, premium: true } }}
      />
    );

    expect(html).toContain('Conecte a conta Asaas da academia');
    expect(html).not.toContain('Conecte sua conta Asaas');
    expect(html).toContain('lista-mock');
  });
});
