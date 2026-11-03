import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { InvoiceStatusChip } from './invoiceStatusChip';

describe('invoice status chip', () => {
  it('UT-132 names every status in text, never color alone', () => {
    const labels = {
      PENDING: 'Pendente',
      OVERDUE: 'Em atraso',
      PAID: 'Paga',
      PAID_MANUALLY: 'Paga manualmente',
      CANCELED: 'Cancelada',
    } as const;

    for (const [status, label] of Object.entries(labels)) {
      const html = renderToStaticMarkup(
        <InvoiceStatusChip status={status as keyof typeof labels} />
      );
      expect(html).toContain(label);
    }
  });
});
