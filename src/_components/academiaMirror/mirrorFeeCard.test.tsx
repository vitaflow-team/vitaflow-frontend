import type { MembershipFee } from '@/_types/membershipFee';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { MirrorFeeCard } from './mirrorFeeCard';

const PENDING: MembershipFee = {
  id: 'f1',
  amountCents: 14990,
  dueDate: '2026-12-10',
  status: 'PENDING',
  paymentUrl: 'https://pay.example.test/f1',
};

const PAID: MembershipFee = {
  id: 'f2',
  amountCents: 14990,
  dueDate: '2026-11-10',
  status: 'PAID',
  paymentUrl: 'https://pay.example.test/f2',
};

describe('MirrorFeeCard — financial-health US-017', () => {
  it('UT-140 renders amount, due date and a "Pagar agora" link to the payment URL for a pending fee', () => {
    const html = renderToStaticMarkup(<MirrorFeeCard fees={[PENDING]} />);

    expect(html).toMatch(/R\$\s149,90/);
    expect(html).toContain('10/12/2026');
    expect(html).toContain('Pendente');
    expect(html).toContain('Pagar agora');
    expect(html).toContain('href="https://pay.example.test/f1"');
    expect(html).toContain('rel="noopener noreferrer"');
  });

  it('UT-140 shows "Pago" without a link for a paid fee', () => {
    const html = renderToStaticMarkup(<MirrorFeeCard fees={[PAID]} />);

    expect(html).toContain('Pago');
    expect(html).not.toContain('Pagar agora');
    expect(html).not.toContain('<a ');
    expect(html).not.toContain('<button');
  });

  it('shows an overdue fee as "Em atraso", in words, with its way to pay (own data, US-017.AC-3)', () => {
    const html = renderToStaticMarkup(
      <MirrorFeeCard fees={[{ ...PENDING, status: 'OVERDUE' }]} />
    );

    expect(html).toContain('Em atraso');
    expect(html).toContain('Pagar agora');
  });

  it('offers no link when an unpaid fee has no payment URL', () => {
    const html = renderToStaticMarkup(
      <MirrorFeeCard fees={[{ ...PENDING, paymentUrl: null }]} />
    );

    expect(html).toContain('Pendente');
    expect(html).not.toContain('<a ');
  });

  it('lists several fees, one row each', () => {
    const html = renderToStaticMarkup(<MirrorFeeCard fees={[PENDING, PAID]} />);

    expect(html.match(/<li /g)).toHaveLength(2);
    expect(html).toContain('Mensalidades');
  });

  it('renders nothing when there are no fees (US-017.EC-1)', () => {
    expect(renderToStaticMarkup(<MirrorFeeCard fees={[]} />)).toBe('');
  });
});
