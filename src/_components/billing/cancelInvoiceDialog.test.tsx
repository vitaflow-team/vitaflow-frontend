import type { ReactNode } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';

vi.mock('@/_actions/billing/cancelInvoice', () => ({ cancelInvoice: vi.fn() }));
vi.mock('next/navigation', () => ({ useRouter: () => ({ refresh: vi.fn() }) }));
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

import { CancelInvoiceDialog } from './cancelInvoiceDialog';

describe('cancel invoice dialog', () => {
  it('UT-126 warns that the payment link stops working', () => {
    const html = renderToStaticMarkup(
      <CancelInvoiceDialog invoiceId="inv-1" />
    );

    expect(html).toContain('link de pagamento deixa de funcionar');
    expect(html).toContain('não pode ser desfeita');
  });
});
