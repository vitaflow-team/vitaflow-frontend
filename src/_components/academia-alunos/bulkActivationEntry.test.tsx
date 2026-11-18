import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';

vi.mock('./bulkActivationDialog', () => ({
  BulkActivationDialog: () => <button type="button">abrir ativação</button>,
}));

import { BulkActivationEntry } from './bulkActivationEntry';

describe('BulkActivationEntry — financial-health US-015.AC-4', () => {
  it('opens the activation when billing is ready', () => {
    const html = renderToStaticMarkup(<BulkActivationEntry billing="READY" />);

    expect(html).toContain('abrir ativação');
    expect(html).not.toContain('<a ');
  });

  it.each([
    ['NOT_CONNECTED', 'Conecte a conta Asaas da academia'],
    ['RECONNECT_NEEDED', 'reconectada'],
    ['SUBSCRIPTION_REQUIRED', 'assinatura ativa'],
  ] as const)(
    'is unavailable while billing is %s, saying why and linking to the billing tab',
    (billing, text) => {
      const html = renderToStaticMarkup(
        <BulkActivationEntry billing={billing} />
      );

      expect(html).not.toContain('abrir ativação');
      expect(html).toContain(text);
      expect(html).toContain('href="/restrict/settings?tab=cobranca"');
    }
  );
});
