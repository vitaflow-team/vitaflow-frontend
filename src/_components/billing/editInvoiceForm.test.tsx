import type { Invoice } from '@/_types/billing';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';

vi.mock('@/_actions/billing/updateInvoice', () => ({ updateInvoice: vi.fn() }));
vi.mock('next/navigation', () => ({ useRouter: () => ({ refresh: vi.fn() }) }));

import { EditInvoiceForm } from './editInvoiceForm';

const INVOICE: Invoice = {
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

describe('edit invoice form', () => {
  it('UT-126 pre-fills the amount and due date from the invoice', () => {
    const html = renderToStaticMarkup(
      <EditInvoiceForm invoice={INVOICE} onDone={() => {}} />
    );

    expect(html).toContain('value="199,90"');
    expect(html).toContain('value="2026-11-20"');
  });

  it('UT-126 disables save when nothing changed yet', () => {
    const html = renderToStaticMarkup(
      <EditInvoiceForm invoice={INVOICE} onDone={() => {}} />
    );

    expect(html).toContain('disabled=""');
  });
});
