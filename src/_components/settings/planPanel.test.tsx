import type { Product } from '@/_actions/products/getPlans';
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
  type: Product['type'],
  stripeId: string | null
): Product {
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

/** Lista plana como `/plans` devolve: preço crescente, empate por nome. */
const CATALOG: Product[] = [
  product('free', 'Gratuito', 0, 'USER', null),
  product('premium', 'Premium', 19.9, 'USER', 'price_premium'),
  product('pe-pro', 'Profissional', 59.9, 'PHYSICAL_EDUCATOR', 'price_pe'),
  product('nutri-pro', 'Profissional', 79.9, 'NUTRITIONIST', 'price_nu'),
];

interface RenderOptions {
  plans?: Product[];
  productId?: string | null;
  profileType?: string | null;
  hasActiveSubscription?: boolean;
  subscriptionCancelAt?: string | null;
  expiresAt?: string | null;
  autoRenew?: boolean;
  clientsCount?: number | null;
  loadFailed?: boolean;
}

function render(options: RenderOptions = {}): string {
  return renderToStaticMarkup(
    <PlanPanel
      plans={options.plans ?? CATALOG}
      productId={options.productId ?? null}
      profileType={options.profileType ?? null}
      hasActiveSubscription={options.hasActiveSubscription ?? false}
      subscriptionCancelAt={options.subscriptionCancelAt ?? null}
      expiresAt={options.expiresAt ?? null}
      autoRenew={options.autoRenew ?? false}
      clientsCount={options.clientsCount ?? null}
      loadFailed={options.loadFailed ?? false}
    />
  );
}

/** Texto visível, sem marcação, para procurar frases como o usuário as lê. */
function text(html: string): string {
  return html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ');
}

describe('plan category tabs and expiry — plan panel', () => {
  // UT-026
  it('Should open on the profile category with its own tab semantics and ids', () => {
    const html = render({ profileType: 'NUTRITIONIST' });

    expect(html).toContain('role="tablist"');
    expect(html.match(/role="tab"/g)).toHaveLength(3);
    expect(text(html)).toContain('Usuário');
    expect(text(html)).toContain('Nutricionista');
    expect(text(html)).toContain('Educador físico');

    // Só a categoria do perfil nasce selecionada.
    expect(html.match(/aria-selected="true"/g)).toHaveLength(1);
    expect(html).toContain(
      'id="plan-category-tab-nutricionista" aria-selected="true"'
    );

    // Nome acessível e ids distintos dos da tira de cima (ADR-005).
    expect(html).toContain('aria-label="Tipo de plano"');
    expect(html).not.toContain('Seções de Configurações');
    expect(html).not.toContain('id="settings-tab-');
  });

  // UT-027
  it('Should offer the same choice as a labelled select below the breakpoint', () => {
    const html = render({ profileType: 'PHYSICAL_EDUCATOR' });

    // As duas variantes existem sempre; o CSS escolhe qual aparece (ADR-005).
    expect(html).toContain('class="hidden sm:flex');
    expect(html).toContain('class="sm:hidden');

    expect(html).toContain('<label for="plan-category-select"');
    expect(text(html)).toContain('Tipo de plano');
    expect(html).toContain('<select');
    expect(html.match(/<option /g)).toHaveLength(3);
    // O select nasce na mesma categoria das abas.
    expect(html).toContain('<select id="plan-category-select" class=');
    expect(html).toContain('value="educador-fisico" selected=""');
    // 44 px de alvo de toque (US-007.EC-2).
    expect(html).toContain('min-h-11');
  });

  // UT-028
  it('Should word the current paid plan as renewing, with its cancel action', () => {
    const body = text(
      render({
        productId: 'premium',
        profileType: 'USER',
        hasActiveSubscription: true,
        expiresAt: '2026-10-18T15:00:00.000Z',
        autoRenew: true,
      })
    );

    expect(body).toContain('Seu plano atual');
    expect(body).toContain('Renova em 18/10/2026');
    expect(body).toContain('Cancelar assinatura');
    expect(body).not.toContain('Expira em');
  });

  // UT-028
  it('Should put a scheduled cancellation in an alert with the reactivate action', () => {
    const html = render({
      productId: 'premium',
      profileType: 'USER',
      hasActiveSubscription: true,
      subscriptionCancelAt: '2026-10-10T15:00:00.000Z',
      expiresAt: '2026-10-10T15:00:00.000Z',
      autoRenew: false,
    });

    expect(text(html)).toContain('Expira em 10/10/2026');
    // Alerta por marcação e ícone, não apenas por cor (US-002.EC-4).
    expect(html).toContain('role="status"');
    expect(html).toContain('bg-warn-bg');
    expect(html).toContain('lucide-triangle-alert');
    expect(text(html)).toContain('Reativar assinatura');
    expect(text(html)).not.toContain('Renova em');
    expect(text(html)).not.toContain('Cancela em');
  });

  // UT-028
  it('Should leave Gratuito without a date and without any action', () => {
    const body = text(
      render({ productId: 'free', profileType: 'USER', expiresAt: null })
    );

    expect(body).toContain('Seu plano atual');
    expect(body).not.toContain('Renova em');
    expect(body).not.toContain('Expira em');
    expect(body).not.toContain('Cancelar assinatura');
    // Os outros planos pagos continuam oferecendo a compra.
    expect(body).toContain('Escolher este plano');
  });

  // UT-029
  it('Should announce an empty category instead of leaving a blank area', () => {
    const html = render({
      plans: [product('free', 'Gratuito', 0, 'USER', null)],
      profileType: 'NUTRITIONIST',
    });

    expect(text(html)).toContain('Nenhum plano disponível para esta categoria');
    expect(html).toContain('role="status"');
  });

  // UT-030
  it('Should mark no card when the current plan is in another category', () => {
    const body = text(
      render({
        productId: 'nutri-pro',
        profileType: 'USER',
        hasActiveSubscription: true,
        expiresAt: '2026-10-18T15:00:00.000Z',
        autoRenew: true,
      })
    );

    // A categoria aberta é "Usuário"; o plano pago é de nutricionista.
    expect(body).toContain('Gratuito');
    expect(body).toContain('Premium');
    expect(body).not.toContain('Seu plano atual');
    expect(body).not.toContain('Renova em');
  });

  it('Should state who each plan of the visible category is for', () => {
    const body = text(render({ profileType: 'USER' }));

    // Só a categoria aberta é renderizada: dois planos de usuário.
    expect(body.match(/Para quem é:/g)).toHaveLength(2);
    expect(body).toContain('acompanha a própria saúde');
    expect(body).not.toContain('Cria uma conta profissional');
  });

  it('Should order the cards of a category by price', () => {
    const body = text(render({ profileType: 'USER' }));

    expect(body.indexOf('Gratuito')).toBeLessThan(body.indexOf('Premium'));
  });

  it('Should replace the list with a clear error when plans fail to load', () => {
    const html = render({ loadFailed: true });

    expect(html).toContain('role="alert"');
    expect(text(html)).toContain('Não foi possível carregar os planos');
    expect(html).not.toContain('role="tablist"');
  });

  it('Should stack in one column on phones and only spread from md up', () => {
    const html = render({ profileType: 'USER' });

    expect(html).toContain('flex flex-col gap-4 md:flex-row');
    expect(html).not.toContain('overflow-x');
  });

  it('Should no longer show the two audience sections', () => {
    const body = text(render({ profileType: 'USER' }));

    expect(body).not.toContain('Para você');
    expect(body).not.toContain('Para profissionais');
  });
});
