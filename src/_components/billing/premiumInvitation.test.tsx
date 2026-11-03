import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { PremiumInvitation } from './premiumInvitation';

describe('premium invitation', () => {
  it('UT-123 invites to Premium with no connect or create control', () => {
    const html = renderToStaticMarkup(<PremiumInvitation />);

    expect(html).toContain('recurso Premium');
    expect(html).not.toContain('<button');
    expect(html).not.toContain('<form');
  });
});
