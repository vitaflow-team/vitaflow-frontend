import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { MirrorFeeRow } from './mirrorFeeRow';

const FEE = {
  id: 'f1',
  amountCents: 9990,
  dueDate: '2026-12-28',
  status: 'PENDING' as const,
  paymentUrl: 'https://pay.example.test/f1',
};

describe('MirrorFeeRow', () => {
  it('opens the payment page in a new tab without leaking the opener', () => {
    const html = renderToStaticMarkup(<MirrorFeeRow fee={FEE} />);

    expect(html).toContain('target="_blank"');
    expect(html).toContain('rel="noopener noreferrer"');
    expect(html).toMatch(/R\$\s99,90/);
    expect(html).toContain('Vencimento: 28/12/2026');
  });

  it('shows no payment control for a paid fee', () => {
    const html = renderToStaticMarkup(
      <MirrorFeeRow fee={{ ...FEE, status: 'PAID' }} />
    );

    expect(html).not.toContain('<a ');
  });
});
