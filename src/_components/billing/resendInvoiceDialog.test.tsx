import type { ReactNode } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';

vi.mock('@/_actions/billing/resendInvoice', () => ({ resendInvoice: vi.fn() }));
vi.mock('@/_components/ui/alert-dialog', () => {
  const Pass = ({ children }: { children?: ReactNode }) => (
    <div>{children}</div>
  );
  return {
    AlertDialog: Pass,
    AlertDialogTrigger: Pass,
    AlertDialogContent: Pass,
    AlertDialogHeader: Pass,
    AlertDialogFooter: Pass,
    AlertDialogTitle: Pass,
    AlertDialogDescription: Pass,
    AlertDialogCancel: Pass,
  };
});

import { ResendInvoiceDialog } from './resendInvoiceDialog';

describe('resend invoice dialog', () => {
  it('UT-126 is enabled with no cooldown', () => {
    const html = renderToStaticMarkup(
      <ResendInvoiceDialog invoiceId="inv-1" canResendAt={null} />
    );

    expect(html).not.toContain('disabled=""');
  });

  it('UT-014 is disabled during the hourly cooldown', () => {
    const future = new Date(Date.now() + 60_000).toISOString();
    const html = renderToStaticMarkup(
      <ResendInvoiceDialog invoiceId="inv-1" canResendAt={future} />
    );

    expect(html).toContain('disabled=""');
  });

  it('is enabled again once the cooldown has passed', () => {
    const past = new Date(Date.now() - 60_000).toISOString();
    const html = renderToStaticMarkup(
      <ResendInvoiceDialog invoiceId="inv-1" canResendAt={past} />
    );

    expect(html).not.toContain('disabled=""');
  });
});
