import { renderToStaticMarkup } from 'react-dom/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const { serverActionState } = vi.hoisted(() => ({
  serverActionState: {
    isPending: false,
    error: null as { message: string } | null,
  },
}));

vi.mock('zsa-react', () => ({
  useServerAction: () => ({ ...serverActionState, execute: vi.fn() }),
}));
vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn(), refresh: vi.fn() }),
}));
vi.mock('@/_hooks/alertHook', () => ({
  useAlertHook: () => ({ openError: vi.fn() }),
}));
vi.mock('@/_actions/users/activateAsCustomer', () => ({
  activateAsCustomer: {},
}));

import { CustomerActivationCard } from './customerActivationCard';

function render(productId: string | null | undefined) {
  return renderToStaticMarkup(<CustomerActivationCard productId={productId} />);
}

describe('unified login account — UT-045 customer activation card', () => {
  beforeEach(() => {
    serverActionState.isPending = false;
    serverActionState.error = null;
  });

  it.each([null, undefined])(
    'offers the opt-in to an account without a plan (productId %s)',
    productId => {
      const html = render(productId);

      expect(html).toContain('Começar a usar o Vita Flow como cliente');
      expect(html).toContain('plano Gratuito');
      expect(html).toContain('Termos de Uso');
      expect(html).toContain('dados de saúde');
    }
  );

  it('renders nothing for an account that already has a plan', () => {
    expect(render('free-1')).toBe('');
  });

  it('keeps the submit button disabled until both consents are ticked', () => {
    const html = render(null);

    expect(html.match(/role="checkbox"/g)).toHaveLength(2);
    expect(html).toContain('aria-checked="false"');
    expect(html).toMatch(/<button[^>]*type="submit"[^>]*disabled=""/);
  });

  it('opens the legal documents in a new tab so the form keeps its state', () => {
    const html = render(null);

    expect(html).toContain('href="/terms"');
    expect(html).toContain('href="/privacy"');
    expect(html).toContain('target="_blank"');
  });

  it('shows the failure message in place', () => {
    serverActionState.error = { message: 'Plano Gratuito indisponível.' };

    const html = render(null);

    expect(html).toContain('role="alert"');
    expect(html).toContain('Plano Gratuito indisponível.');
  });
});
