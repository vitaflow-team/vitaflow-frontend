import { todayInBrazil } from '@/_lib/studentsDates';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';

vi.mock('@/_actions/billing/markPaidInvoice', () => ({
  markPaidInvoice: vi.fn(),
}));
vi.mock('next/navigation', () => ({ useRouter: () => ({ refresh: vi.fn() }) }));

import { MarkPaidForm } from './markPaidForm';

describe('mark paid form', () => {
  it('UT-126 defaults the payment date to today and caps it at today', () => {
    const today = todayInBrazil();
    const html = renderToStaticMarkup(
      <MarkPaidForm invoiceId="inv-1" onDone={() => {}} />
    );

    expect(html).toContain(`value="${today}"`);
    expect(html).toContain(`max="${today}"`);
  });

  it('UT-126 caps the note at 200 characters', () => {
    const html = renderToStaticMarkup(
      <MarkPaidForm invoiceId="inv-1" onDone={() => {}} />
    );

    expect(html).toContain('maxLength="200"');
  });
});
