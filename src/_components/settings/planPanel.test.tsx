import type { ProductsPlan } from '@/_actions/products/getProdductsPlans';
import { PlanPanel } from '@/_components/settings/planPanel';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';

// As ações de assinatura tocam Stripe e cookies na importação; o painel não
// depende do que elas fazem, só de que os botões certos apareçam.
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

// Hooks de cliente que só existem com provider/roteador montados; o painel é
// verificado pela marcação que ele produz, não pelo que os botões executam.
vi.mock('@/_hooks/alertHook', () => ({
  useAlertHook: () => ({ openError: vi.fn() }),
}));
vi.mock('next/navigation', () => ({
  useRouter: () => ({ refresh: vi.fn(), push: vi.fn() }),
}));

function product(
  id: string,
  name: string,
  price: number,
  type: ProductsPlan['products'][number]['type'],
  stripeId: string | null
): ProductsPlan['products'][number] {
  return {
    id,
    name,
    price,
    groupId: 'g',
    type,
    stripeId,
    createdAt: '',
    updatedAt: '',
    productInfos: [],
  };
}

const CATALOG: ProductsPlan[] = [
  {
    id: 'g-user',
    name: 'Usuário',
    createdAt: '',
    updatedAt: '',
    products: [
      product('premium', 'Premium', 19.9, 'USER', 'price_premium'),
      product('free', 'Gratuito', 0, 'USER', null),
    ],
  },
  {
    id: 'g-pe',
    name: 'Educadores físicos',
    createdAt: '',
    updatedAt: '',
    products: [
      product('pe-pro', 'Profissional', 59.9, 'PHYSICAL_EDUCATOR', 'price_pe'),
    ],
  },
  {
    id: 'g-nutri',
    name: 'Nutricionistas',
    createdAt: '',
    updatedAt: '',
    products: [
      product('nutri-pro', 'Profissional', 79.9, 'NUTRITIONIST', 'price_nu'),
    ],
  },
];

interface RenderOptions {
  plans?: ProductsPlan[];
  productId?: string | null;
  hasActiveSubscription?: boolean;
  subscriptionCancelAt?: string | null;
  subscriptionCurrentPeriodEnd?: string | null;
  clientsCount?: number | null;
  loadFailed?: boolean;
}

function render(options: RenderOptions = {}): string {
  return renderToStaticMarkup(
    <PlanPanel
      plans={options.plans ?? CATALOG}
      productId={options.productId ?? null}
      hasActiveSubscription={options.hasActiveSubscription ?? false}
      subscriptionCancelAt={options.subscriptionCancelAt ?? null}
      subscriptionCurrentPeriodEnd={
        options.subscriptionCurrentPeriodEnd ?? null
      }
      clientsCount={options.clientsCount ?? null}
      loadFailed={options.loadFailed ?? false}
    />
  );
}

/** Texto visível, sem marcação, para procurar frases como o usuário as lê. */
function text(html: string): string {
  return html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ');
}

describe('plan catalog panel', () => {
  it('Should show both audience sections with the professional subheadings', () => {
    const body = text(render());

    expect(body).toContain('Para você');
    expect(body).toContain('Para profissionais');
    expect(body).toContain('Nutricionistas');
    expect(body).toContain('Educadores físicos');
    // Nutricionistas antes de Educadores físicos (ADR-001).
    expect(body.indexOf('Nutricionistas')).toBeLessThan(
      body.indexOf('Educadores físicos')
    );
  });

  it('Should order the cards of a section by price', () => {
    const body = text(render());

    expect(body.indexOf('Gratuito')).toBeLessThan(body.indexOf('Premium'));
  });

  it('Should mark the current plan beside its name, as text', () => {
    const body = text(render({ productId: 'nutri-pro' }));

    expect(body).toContain('Seu plano atual');
    expect(body.match(/Seu plano atual/g)).toHaveLength(1);
  });

  it('Should mark Gratuito as current when the stored product is unknown', () => {
    const html = render({ productId: 'gone' });
    const upToBadge = text(html).indexOf('Seu plano atual');

    expect(upToBadge).toBeGreaterThan(-1);
    expect(text(html).slice(0, upToBadge)).toContain('Gratuito');
  });

  it('Should state who each plan is for', () => {
    const body = text(render());

    expect(body.match(/Para quem é:/g)).toHaveLength(4);
    expect(body).toContain('inclui o uso pessoal do Premium');
    expect(body).toContain('Cria uma conta profissional');
  });

  it('Should never offer a purchase action on Gratuito', () => {
    const body = text(render({ productId: 'free' }));

    expect(body).not.toContain('Escolher este plano</button>');
    // O card do plano atual não oferece troca; só os outros pagos.
    expect(body).toContain('Escolher este plano');
    expect(body).not.toContain('Cancelar assinatura');
  });

  it('Should offer cancellation, not a change, on the current paid plan', () => {
    const body = text(
      render({
        productId: 'premium',
        hasActiveSubscription: true,
        subscriptionCurrentPeriodEnd: '2026-10-20T00:00:00.000Z',
      })
    );

    expect(body).toContain('Cancelar assinatura');
    expect(body).toContain('Renova em');
    expect(body).toContain('Trocar para este plano');
  });

  it('Should keep the scheduled-cancellation state and its reactivate action', () => {
    const body = text(
      render({
        productId: 'premium',
        hasActiveSubscription: true,
        subscriptionCancelAt: '2026-10-20T00:00:00.000Z',
        subscriptionCurrentPeriodEnd: '2026-10-20T00:00:00.000Z',
      })
    );

    expect(body).toContain('Cancela em');
    expect(body).toContain('Reativar assinatura');
    expect(body).not.toContain('Renova em');
  });

  it('Should omit a section that has no products', () => {
    const body = text(render({ plans: [CATALOG[0]] }));

    expect(body).toContain('Para você');
    expect(body).not.toContain('Para profissionais');
  });

  it('Should replace the list with a clear error when plans fail to load', () => {
    const html = render({ loadFailed: true });

    expect(html).toContain('role="alert"');
    expect(text(html)).toContain('Não foi possível carregar os planos');
    expect(text(html)).not.toContain('Para você');
  });

  it('Should stack in one column on phones and only spread from md up', () => {
    const html = render();

    expect(html).toContain('flex flex-col gap-4 md:flex-row');
    expect(html).not.toContain('overflow-x');
  });
});
