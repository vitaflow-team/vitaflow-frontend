import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { PremiumGate } from './premiumGate';

describe('PremiumGate', () => {
  it('links to the plan upgrade tab', () => {
    const markup = renderToStaticMarkup(<PremiumGate />);

    expect(markup).toContain('/restrict/settings?tab=plano');
    expect(markup).toContain('Premium');
  });
});
