import { CancelSubscriptionControl } from '@/_components/upgrade/cancelSubscriptionControl';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';

// As ações tocam Stripe e cookies na importação; aqui só interessa qual
// controle aparece, não o que ele executa.
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

function render(subscriptionCancelAt: string | null): string {
  return renderToStaticMarkup(
    <CancelSubscriptionControl subscriptionCancelAt={subscriptionCancelAt} />
  );
}

function text(html: string): string {
  return html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ');
}

// UT-034
describe('plan category tabs and expiry — cancel subscription control', () => {
  it('Should offer reactivation, and no date of its own, with a scheduled cancellation', () => {
    const html = render('2026-10-10T15:00:00.000Z');

    expect(text(html)).toContain('Reativar assinatura');
    expect(text(html)).not.toContain('Cancelar assinatura');
    // A data é escrita uma vez só, pelo card e pelo rodapé (ADR-004).
    expect(text(html)).not.toContain('Cancela em');
    expect(text(html)).not.toContain('Expira em');
    expect(html).not.toMatch(/\d{2}\/\d{2}\/\d{4}/);
  });

  it('Should offer cancellation while the subscription renews', () => {
    const html = render(null);

    expect(text(html)).toContain('Cancelar assinatura');
    expect(text(html)).not.toContain('Reativar assinatura');
    expect(html).not.toMatch(/\d{2}\/\d{2}\/\d{4}/);
  });
});
