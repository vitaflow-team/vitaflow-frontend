import type { InvoiceList } from '@/_types/billing';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';

vi.mock('@/_components/billing/invoiceGenerationPanel', () => ({
  InvoiceGenerationPanel: () => <p>painel de geração</p>,
}));
vi.mock('@/_components/billing/taxIdSection', () => ({
  TaxIdSection: () => null,
}));
vi.mock('@/_components/billing/editInvoiceDialog', () => ({
  EditInvoiceDialog: () => <button type="button">Editar</button>,
}));
vi.mock('@/_components/billing/cancelInvoiceDialog', () => ({
  CancelInvoiceDialog: () => <button type="button">Cancelar cobrança</button>,
}));
vi.mock('@/_components/billing/markPaidInvoiceDialog', () => ({
  MarkPaidInvoiceDialog: () => <button type="button">Marcar como paga</button>,
}));
vi.mock('@/_components/billing/resendInvoiceDialog', () => ({
  ResendInvoiceDialog: () => <button type="button">Reenviar e-mail</button>,
}));

import { GymStudentBilling } from './gymStudentBilling';

const FEES: InvoiceList = {
  items: [
    {
      id: 'inv-1',
      competenceYear: 2026,
      competenceMonth: 12,
      amountCents: 14990,
      dueDate: '2026-12-10',
      status: 'PENDING',
      paidAt: null,
      paidAmountCents: null,
      manualNote: null,
      paymentUrl: 'https://pay.example.test/1',
      canResendAt: null,
    },
  ],
  total: 1,
  page: 1,
  pageSize: 20,
  situation: 'PENDING',
  taxId: { present: true, masked: '***.***.***-25' },
  gateway: { connected: true, premium: true },
};

describe('GymStudentBilling — financial-health US-016', () => {
  it('shows the monthly fees under a "Cobrança" heading with mark paid, resend and cancel', () => {
    const html = renderToStaticMarkup(
      <GymStudentBilling clientId="s1" invoices={FEES} />
    );

    expect(html).toContain('>Cobrança</h2>');
    expect(html).toContain('Dezembro de 2026');
    expect(html).toContain('Marcar como paga');
    expect(html).toContain('Reenviar e-mail');
    expect(html).toContain('Cancelar cobrança');
  });

  it('never offers the manual generation panel or the edit action, which gym fees do not allow', () => {
    const html = renderToStaticMarkup(
      <GymStudentBilling clientId="s1" invoices={FEES} />
    );

    expect(html).not.toContain('painel de geração');
    expect(html).not.toContain('Editar');
  });

  it('shows the paid-subscription message, not the Premium invitation, when the gym has no paid plan', () => {
    const html = renderToStaticMarkup(
      <GymStudentBilling
        clientId="s1"
        invoices={{ ...FEES, gateway: { connected: false, premium: false } }}
      />
    );

    expect(html).toContain('exige uma assinatura ativa');
    expect(html).not.toContain('Premium');
    expect(html).not.toContain('Dezembro de 2026');
  });

  it('says the fees could not be loaded instead of rendering an empty list', () => {
    const html = renderToStaticMarkup(
      <GymStudentBilling clientId="s1" invoices="failed" />
    );

    expect(html).toContain('Não foi possível carregar as cobranças');
  });

  it('pages through the fees of this student on the gym student screen', () => {
    const html = renderToStaticMarkup(
      <GymStudentBilling
        clientId="s1"
        invoices={{ ...FEES, total: 45, page: 1 }}
      />
    );

    expect(html).toContain('href="/restrict/academia-alunos/s1?page=2"');
  });
});
