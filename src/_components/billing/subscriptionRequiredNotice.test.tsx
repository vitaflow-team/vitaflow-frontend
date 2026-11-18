import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { SubscriptionRequiredNotice } from './subscriptionRequiredNotice';

describe('SubscriptionRequiredNotice', () => {
  it('asks a gym owner for an active subscription and never mentions Premium', () => {
    const html = renderToStaticMarkup(<SubscriptionRequiredNotice />);

    expect(html).toContain('exige uma assinatura ativa');
    expect(html).not.toContain('Premium');
  });

  it('offers no connect or create control', () => {
    const html = renderToStaticMarkup(<SubscriptionRequiredNotice />);

    expect(html).not.toContain('<button');
    expect(html).not.toContain('<a ');
    expect(html).not.toContain('<form');
  });

  it('says issued invoices stay visible', () => {
    expect(renderToStaticMarkup(<SubscriptionRequiredNotice />)).toContain(
      'continuam visíveis'
    );
  });
});
