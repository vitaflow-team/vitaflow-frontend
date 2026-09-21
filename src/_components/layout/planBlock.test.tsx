import { PlanBlock } from '@/_components/layout/planBlock';
import { getPlanSummary } from '@/_lib/planSummary';
import type { ProfileShell } from '@/_types/shell';
import type { ReactNode } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const sidebarState = { state: 'expanded' as 'expanded' | 'collapsed' };

vi.mock('@/_components/ui/sidebar', () => ({
  useSidebar: () => sidebarState,
}));

// O tooltip do Radix nasce fechado e manda o conteúdo para um portal, então
// ele não aparece na marcação estática. O duplo abaixo mantém a estrutura e
// deixa o texto do estado recolhido visível para a asserção (US-004.EC-1).
vi.mock('@/_components/ui/tooltip', () => ({
  Tooltip: ({ children }: { children: ReactNode }) => <div>{children}</div>,
  TooltipTrigger: ({ children }: { children: ReactNode }) => (
    <div>{children}</div>
  ),
  TooltipContent: ({ children }: { children: ReactNode }) => (
    <div data-slot="tooltip-content">{children}</div>
  ),
}));

function profile(overrides: Partial<ProfileShell> = {}): ProfileShell {
  return {
    firstName: 'Ana',
    avatar: null,
    productName: 'Premium',
    subscriptionStatus: 'active',
    expiresAt: '2026-10-18T15:00:00.000Z',
    autoRenew: true,
    ...overrides,
  };
}

function render(
  input: ProfileShell | null,
  state: 'expanded' | 'collapsed' = 'expanded'
): string {
  sidebarState.state = state;
  return renderToStaticMarkup(<PlanBlock plan={getPlanSummary(input)} />);
}

function text(html: string): string {
  return html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ');
}

beforeEach(() => {
  sidebarState.state = 'expanded';
});

// UT-031
describe('plan category tabs and expiry — sidebar plan block', () => {
  it('Should show the renewal date with the plan name', () => {
    const html = render(profile());

    expect(text(html)).toContain('Plano Premium');
    expect(text(html)).toContain('Renova em 18/10/2026');
    expect(html).not.toContain('bg-warn-bg');
  });

  it('Should show a cancelled plan as an expiry alert with an icon', () => {
    const html = render(
      profile({ expiresAt: '2026-10-10T15:00:00.000Z', autoRenew: false })
    );

    expect(text(html)).toContain('Expira em 10/10/2026');
    // Texto e ícone, não apenas cor, e anunciado como texto (US-004.EC-3).
    expect(html).toContain('role="status"');
    expect(html).toContain('bg-warn-bg');
    expect(html).toContain('lucide-triangle-alert');
    expect(text(html)).not.toContain('Renova em');
  });

  it('Should show no date on Gratuito', () => {
    const html = render(
      profile({
        productName: null,
        subscriptionStatus: null,
        expiresAt: null,
        autoRenew: false,
      })
    );

    expect(text(html)).toContain('Plano Gratuito');
    expect(text(html)).not.toContain('Renova em');
    expect(text(html)).not.toContain('Expira em');
  });

  it('Should fall back to the plan name without a date when the profile is missing', () => {
    const html = render(null);

    expect(text(html)).toContain('Seu plano');
    expect(text(html)).not.toContain('Renova em');
    expect(text(html)).not.toContain('Expira em');
  });

  it('Should repeat the same wording in the collapsed tooltip', () => {
    const renewing = render(profile(), 'collapsed');
    const cancelled = render(
      profile({ expiresAt: '2026-10-10T15:00:00.000Z', autoRenew: false }),
      'collapsed'
    );

    expect(text(renewing)).toContain('Plano Premium — Renova em 18/10/2026');
    expect(text(cancelled)).toContain('Plano Premium — Expira em 10/10/2026');
  });

  it('Should never offer cancelling or reactivating from the sidebar', () => {
    const html = render(
      profile({ expiresAt: '2026-10-10T15:00:00.000Z', autoRenew: false })
    );

    expect(html).not.toContain('<button');
    expect(text(html)).not.toContain('Cancelar assinatura');
    expect(text(html)).not.toContain('Reativar assinatura');
  });
});
