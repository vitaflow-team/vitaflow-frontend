import { currentCompetence } from '@/_lib/billingDates';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';

vi.mock('@/_actions/billing/createInvoice', () => ({ createInvoice: vi.fn() }));
vi.mock('next/navigation', () => ({ useRouter: () => ({ refresh: vi.fn() }) }));

import { InvoiceGenerationPanel } from './invoiceGenerationPanel';

describe('invoice generation panel', () => {
  it('UT-125 starts on the current competence', () => {
    const { year, month } = currentCompetence();
    const html = renderToStaticMarkup(
      <InvoiceGenerationPanel clientId="c1" needsTaxId={false} />
    );

    expect(html).toContain(`value="${year}-${String(month).padStart(2, '0')}"`);
  });

  it('UT-125 shows the tax-number field only for a first invoice', () => {
    const withoutTaxId = renderToStaticMarkup(
      <InvoiceGenerationPanel clientId="c1" needsTaxId={false} />
    );
    const needsTaxId = renderToStaticMarkup(
      <InvoiceGenerationPanel clientId="c1" needsTaxId />
    );

    expect(withoutTaxId).not.toContain('CPF ou CNPJ');
    expect(needsTaxId).toContain('CPF ou CNPJ');
  });

  it('UT-125 shows the amount and due date fields, and an enabled submit', () => {
    const html = renderToStaticMarkup(
      <InvoiceGenerationPanel clientId="c1" needsTaxId={false} />
    );

    expect(html).toContain('Valor (R$)');
    expect(html).toContain('Vencimento');
    expect(html).toContain('Gerar cobrança');
    expect(html).not.toContain('disabled=""');
  });
});
