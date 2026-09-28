import { ChangePlanButton } from '@/_components/upgrade/changePlanButton';
import { summarizePlanChange } from '@/_lib/planChangeSummary';
import type { ComponentProps, ReactNode } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';

vi.mock('@/_actions/stripe/changeSubscriptionPlan', () => ({
  actionChangeSubscriptionPlan: vi.fn(),
}));
vi.mock('@/_hooks/alertHook', () => ({
  useAlertHook: () => ({ openError: vi.fn() }),
}));
vi.mock('next/navigation', () => ({
  useRouter: () => ({ refresh: vi.fn(), push: vi.fn() }),
}));

// The Radix dialog starts closed and portals its content, so none of it
// reaches static markup. This double keeps the structure inline so the
// dialog body can be asserted.
vi.mock('@/_components/ui/dialog', () => {
  const Pass = ({ children }: { children?: ReactNode }) => (
    <div>{children}</div>
  );
  return {
    Dialog: Pass,
    DialogTrigger: Pass,
    DialogContent: Pass,
    DialogHeader: Pass,
    DialogFooter: Pass,
    DialogTitle: ({ children }: { children?: ReactNode }) => (
      <h2>{children}</h2>
    ),
    DialogDescription: ({ children }: { children?: ReactNode }) => (
      <p>{children}</p>
    ),
  };
});

const SUMMARY = summarizePlanChange({
  current: { id: 'premium', type: 'USER' },
  target: { id: 'nutri-pro', type: 'NUTRITIONIST' },
  hasActiveSubscription: true,
  clientsCount: null,
});

function render(props: Partial<ComponentProps<typeof ChangePlanButton>> = {}) {
  return renderToStaticMarkup(
    <ChangePlanButton
      productId="nutri-pro"
      planName="Profissional"
      {...props}
    />
  );
}

function text(html: string): string {
  return html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ');
}

describe('test coverage — change plan button', () => {
  // UT-011
  it('opens from a trigger and confirms the change', () => {
    const body = text(render());

    expect(body).toContain('Trocar para este plano');
    expect(body).toContain('Trocar de plano');
    expect(body).toContain('Confira o que muda antes de confirmar.');
    expect(body).toContain('Confirmar troca');
    expect(body).not.toContain('Atualizando…');
  });

  // UT-011
  it('falls back to the pro-rata sentence without a summary', () => {
    const body = text(render());

    expect(body).toContain(
      'Sua assinatura atual será atualizada para Profissional.'
    );
    expect(body).toContain('pro-rata');
  });
});

describe('test coverage — change plan button summary', () => {
  // UT-011
  it('shows the plan change summary when it has everything it needs', () => {
    const body = text(
      render({
        summary: SUMMARY,
        currentPlanName: 'Premium',
        currentType: 'USER',
        targetType: 'NUTRITIONIST',
      })
    );

    expect(body).toContain('Plano atual: Premium .');
    expect(body).toContain('Novo plano: Profissional .');
    expect(body).toContain('Você passa a ter acesso a: Pessoas .');
    expect(body).not.toContain('Sua assinatura atual será atualizada');
  });

  // UT-011
  it('keeps the fallback when the summary lacks the current plan name', () => {
    const body = text(
      render({
        summary: SUMMARY,
        currentType: 'USER',
        targetType: 'NUTRITIONIST',
      })
    );

    expect(body).toContain('Sua assinatura atual será atualizada');
  });
});
