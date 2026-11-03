import type { Invoice } from '@/_types/billing';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';

vi.mock('./editInvoiceDialog', () => ({
  EditInvoiceDialog: () => <button type="button">Editar</button>,
}));
vi.mock('./cancelInvoiceDialog', () => ({
  CancelInvoiceDialog: () => <button type="button">Cancelar cobrança</button>,
}));
vi.mock('./markPaidInvoiceDialog', () => ({
  MarkPaidInvoiceDialog: () => <button type="button">Marcar como paga</button>,
}));
vi.mock('./resendInvoiceDialog', () => ({
  ResendInvoiceDialog: () => <button type="button">Reenviar e-mail</button>,
}));

import { InvoiceList } from './invoiceList';

const BASE: Invoice = {
  id: 'inv-1',
  competenceYear: 2026,
  competenceMonth: 11,
  amountCents: 19990,
  dueDate: '2026-11-20',
  status: 'PENDING',
  paidAt: null,
  paidAmountCents: null,
  manualNote: null,
  paymentUrl: null,
  canResendAt: null,
};

describe('invoice list', () => {
  it('UT-124 shows the empty state on the first page with no invoices', () => {
    const html = renderToStaticMarkup(
      <InvoiceList items={[]} total={0} page={1} pageSize={20} basePath="/x" />
    );

    expect(html).toContain('Nenhuma cobrança gerada ainda');
  });

  it('UT-124 shows competence, amount in reais, due date and status as text', () => {
    const html = renderToStaticMarkup(
      <InvoiceList
        items={[BASE]}
        total={1}
        page={1}
        pageSize={20}
        basePath="/x"
      />
    );

    expect(html).toContain('Novembro de 2026');
    expect(html).toMatch(/R\$\s?199,90/);
    expect(html).toContain('20/11/2026');
    expect(html).toContain('Pendente');
  });

  it('UT-124 shows the payment date only for a paid invoice', () => {
    const paid: Invoice = {
      ...BASE,
      status: 'PAID',
      paidAt: '2026-11-18',
    };
    const html = renderToStaticMarkup(
      <InvoiceList
        items={[paid]}
        total={1}
        page={1}
        pageSize={20}
        basePath="/x"
      />
    );

    expect(html).toContain('Pago em: 18/11/2026');
  });

  it('UT-124 offers edit/cancel/mark-paid/resend only for an open invoice', () => {
    const open = renderToStaticMarkup(
      <InvoiceList
        items={[BASE]}
        total={1}
        page={1}
        pageSize={20}
        basePath="/x"
      />
    );
    expect(open).toContain('Cancelar cobrança');

    const canceled: Invoice = { ...BASE, status: 'CANCELED' };
    const closedHtml = renderToStaticMarkup(
      <InvoiceList
        items={[canceled]}
        total={1}
        page={1}
        pageSize={20}
        basePath="/x"
      />
    );
    expect(closedHtml).not.toContain('Cancelar cobrança');
    expect(closedHtml).not.toContain('Editar');
  });

  it('UT-124 pages when there is more than one page', () => {
    const html = renderToStaticMarkup(
      <InvoiceList
        items={[BASE]}
        total={40}
        page={1}
        pageSize={20}
        basePath="/x"
      />
    );

    expect(html).toContain('Página 1 de 2');
    expect(html).toContain('href="/x?page=2"');
  });
});
