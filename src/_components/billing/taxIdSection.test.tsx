import type { TaxId } from '@/_types/billing';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';

vi.mock('./replaceTaxIdForm', () => ({
  ReplaceTaxIdForm: () => <p>formulário de substituição</p>,
}));

import { TaxIdSection } from './taxIdSection';

describe('tax id section', () => {
  it('UT-127 shows the stored tax id masked, never the full number', () => {
    const taxId: TaxId = { present: true, masked: '***.***.***-25' };
    const html = renderToStaticMarkup(
      <TaxIdSection clientId="c1" taxId={taxId} />
    );

    expect(html).toContain('***.***.***-25');
    expect(html).toContain('Substituir');
    expect(html).not.toMatch(/\d{3}\.\d{3}\.\d{3}-\d{2}/);
  });

  it('renders nothing before a first tax id is on file', () => {
    const html = renderToStaticMarkup(
      <TaxIdSection clientId="c1" taxId={{ present: false, masked: null }} />
    );

    expect(html).toBe('');
  });
});
