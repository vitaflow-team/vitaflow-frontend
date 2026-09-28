import { UpgradeCard } from '@/_components/upgrade/upgradeCard';
import type { ComponentProps } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';

// The card's actions touch Stripe and cookies on import; only which control
// the card offers matters here, not what it runs.
vi.mock('@/_actions/stripe/createCheckoutSession', () => ({
  actionCreateCheckoutSession: vi.fn(),
}));
vi.mock('@/_actions/stripe/changeSubscriptionPlan', () => ({
  actionChangeSubscriptionPlan: vi.fn(),
}));
vi.mock('@/_actions/stripe/cancelSubscription', () => ({
  actionCancelSubscription: vi.fn(),
}));
vi.mock('@/_actions/stripe/reactivateSubscription', () => ({
  actionReactivateSubscription: vi.fn(),
}));
vi.mock('@/_hooks/alertHook', () => ({
  useAlertHook: () => ({ openError: vi.fn() }),
}));
vi.mock('next/navigation', () => ({
  useRouter: () => ({ refresh: vi.fn(), push: vi.fn() }),
}));

function render(props: Partial<ComponentProps<typeof UpgradeCard>> = {}) {
  return renderToStaticMarkup(
    <UpgradeCard title="Premium" value={19.9} productId="premium" {...props} />
  );
}

function text(html: string): string {
  return html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ');
}

describe('test coverage — upgrade card content', () => {
  // UT-011
  it('shows the title, monthly price, audience and benefits', () => {
    const body = text(
      render({
        audience: 'Quem acompanha a própria saúde.',
        itens: ['Treinos ilimitados', 'Histórico completo'],
      })
    );

    expect(body).toContain('Premium');
    expect(body).toMatch(/R\$\s19,90/);
    expect(body).toContain('/mês');
    expect(body).toContain('Para quem é: Quem acompanha a própria saúde.');
    expect(body).toContain('Treinos ilimitados');
    expect(body).toContain('Histórico completo');
  });

  // UT-011
  it('marks a featured plan as the most popular', () => {
    expect(text(render({ featured: true }))).toContain('Mais popular');
    expect(text(render())).not.toContain('Mais popular');
  });
});

describe('test coverage — upgrade card actions', () => {
  // UT-011
  it('offers checkout for a paid plan without an active subscription', () => {
    const body = text(render());

    expect(body).toContain('Escolher este plano');
    expect(body).not.toContain('Trocar para este plano');
    expect(body).not.toContain('Seu plano atual');
  });

  // UT-011
  it('offers a plan change while another subscription is active', () => {
    const body = text(render({ hasActiveSubscription: true }));

    expect(body).toContain('Trocar para este plano');
    expect(body).not.toContain('Escolher este plano');
  });

  // UT-011
  it('offers no action for the free plan or a card without a product', () => {
    const free = text(render({ value: 0 }));
    const noProduct = text(render({ productId: undefined }));

    for (const body of [free, noProduct]) {
      expect(body).not.toContain('Escolher este plano');
      expect(body).not.toContain('Trocar para este plano');
      expect(body).not.toContain('Cancelar assinatura');
    }
  });
});

describe('test coverage — upgrade card current plan', () => {
  // UT-011
  it('marks the current plan and offers cancellation with its renewal date', () => {
    const html = render({
      active: true,
      hasActiveSubscription: true,
      planExpiry: { kind: 'renews', label: 'Renova em 18/10/2026' },
    });

    expect(text(html)).toContain('Seu plano atual');
    expect(text(html)).toContain('Renova em 18/10/2026');
    expect(text(html)).toContain('Cancelar assinatura');
    expect(html).not.toContain('role="status"');
  });

  // UT-011
  it('puts an expiring current plan in an alert', () => {
    const html = render({
      active: true,
      hasActiveSubscription: true,
      subscriptionCancelAt: '2026-10-10T15:00:00.000Z',
      planExpiry: { kind: 'expires', label: 'Expira em 10/10/2026' },
    });

    expect(html).toContain('role="status"');
    expect(html).toContain('lucide-triangle-alert');
    expect(text(html)).toContain('Expira em 10/10/2026');
    expect(text(html)).toContain('Reativar assinatura');
  });

  // UT-011
  it('stays informational, with no badge, date or action', () => {
    const body = text(
      render({
        information: true,
        active: true,
        planExpiry: { kind: 'renews', label: 'Renova em 18/10/2026' },
      })
    );

    expect(body).toContain('Premium');
    expect(body).not.toContain('Seu plano atual');
    expect(body).not.toContain('Renova em');
    expect(body).not.toContain('Cancelar assinatura');
  });
});
