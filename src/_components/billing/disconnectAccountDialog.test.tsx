import type { ReactNode } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';

vi.mock('@/_actions/billing/disconnectAccount', () => ({
  disconnectAccount: vi.fn(),
}));
vi.mock('next/navigation', () => ({ useRouter: () => ({ refresh: vi.fn() }) }));
vi.mock('@/_components/ui/alert-dialog', () => {
  const Pass = ({ children }: { children?: ReactNode }) => (
    <div>{children}</div>
  );
  const Action = ({ children }: { children?: ReactNode }) => (
    <button type="button">{children}</button>
  );
  return {
    AlertDialog: Pass,
    AlertDialogTrigger: Pass,
    AlertDialogContent: Pass,
    AlertDialogHeader: Pass,
    AlertDialogFooter: Pass,
    AlertDialogTitle: Pass,
    AlertDialogDescription: Pass,
    AlertDialogCancel: Action,
  };
});

import { DisconnectAccountDialog } from './disconnectAccountDialog';

describe('disconnect account dialog', () => {
  it('UT-122 states there are no open invoices', () => {
    const html = renderToStaticMarkup(
      <DisconnectAccountDialog openInvoiceCount={0} />
    );

    expect(html).toContain('não tem cobranças em aberto');
  });

  it('UT-122 states the exact number of open invoices, singular', () => {
    const html = renderToStaticMarkup(
      <DisconnectAccountDialog openInvoiceCount={1} />
    );

    expect(html).toContain('1 cobrança em aberto');
  });

  it('UT-122 states the exact number of open invoices, plural', () => {
    const html = renderToStaticMarkup(
      <DisconnectAccountDialog openInvoiceCount={3} />
    );

    expect(html).toContain('3 cobranças em aberto');
  });
});
