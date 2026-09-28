import type { Product } from '@/_actions/products/getPlans';
import type { SettingsProfile } from '@/_types/settingsProfile';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';

// The panels are checked through the props they hand to each section; the
// sections have their own tests.
vi.mock('@/_components/settings/accountPanel', () => ({
  AccountPanel: (props: object) => (
    <pre data-section="account">{JSON.stringify(props)}</pre>
  ),
}));
vi.mock('@/_components/settings/planPanel', () => ({
  PlanPanel: (props: object) => (
    <pre data-section="plan">{JSON.stringify(props)}</pre>
  ),
}));
vi.mock('./form', () => ({
  default: (props: object) => (
    <pre data-section="profile">{JSON.stringify(props)}</pre>
  ),
}));

import { SettingsPanel } from './settingsPanel';

// Only the fields every profile carries; no plan data at all.
const SPARSE_PROFILE: SettingsProfile = {
  name: 'Ana Souza',
  email: 'ana@example.test',
  phone: '',
  birthDate: '',
  address: {
    addressLine1: '',
    addressLine2: '',
    district: '',
    city: '',
    region: '',
    postalCode: '',
  },
};

const PROFILE: SettingsProfile = {
  ...SPARSE_PROFILE,
  productId: 'premium',
  productType: 'NUTRITIONIST',
  subscriptionStatus: 'active',
  subscriptionCancelAt: null,
  expiresAt: '2026-12-01T00:00:00.000Z',
  autoRenew: true,
  clientsCount: 2,
};

const PLANS = [{ id: 'premium' }] as Product[];

function sectionProps(markup: string): Record<string, unknown> {
  const json = markup.match(/<pre[^>]*>(.*)<\/pre>/)?.[1] ?? '{}';
  return JSON.parse(json.replaceAll('&quot;', '"'));
}

function render(tab: 'perfil' | 'plano' | 'conta', profile = PROFILE) {
  return renderToStaticMarkup(
    <SettingsPanel tab={tab} profile={profile} plans={PLANS} plansFailed />
  );
}

describe('refactor — settings account and profile panels', () => {
  // UT-007
  it('feeds the account section from the fresh profile', () => {
    const markup = render('conta');

    expect(markup).toContain('Minha conta');
    expect(sectionProps(markup)).toEqual({
      email: 'ana@example.test',
      clientsCount: 2,
      isProfessional: true,
      hasPaidSubscription: true,
    });
  });

  // UT-007
  it('hands the profile form only the fields it edits', () => {
    const markup = render('perfil');

    expect(markup).toContain('Meu perfil');
    const { profile } = sectionProps(markup) as {
      profile: Record<string, unknown>;
    };
    expect(profile.name).toBe('Ana Souza');
    expect(profile).not.toHaveProperty('productId');
    expect(profile).not.toHaveProperty('subscriptionStatus');
  });
});

describe('refactor — settings plan panel and load failure', () => {
  // UT-007
  it('feeds the plan section with the catalog and the profile plan', () => {
    const markup = render('plano');

    expect(markup).toContain('Meu plano');
    expect(sectionProps(markup)).toEqual({
      plans: PLANS,
      productId: 'premium',
      profileType: 'NUTRITIONIST',
      hasActiveSubscription: true,
      subscriptionCancelAt: null,
      expiresAt: '2026-12-01T00:00:00.000Z',
      autoRenew: true,
      clientsCount: 2,
      loadFailed: true,
    });
  });

  // UT-005
  it('defaults the plan fields a sparse profile leaves out', () => {
    const markup = render('plano', SPARSE_PROFILE);

    expect(sectionProps(markup)).toMatchObject({
      hasActiveSubscription: false,
      subscriptionCancelAt: null,
      expiresAt: null,
      autoRenew: false,
      clientsCount: null,
    });
  });

  // UT-005
  it('replaces only the panel content when the profile failed to load', () => {
    const markup = renderToStaticMarkup(
      <SettingsPanel
        tab="conta"
        profile={null}
        plans={[]}
        plansFailed={false}
      />
    );

    expect(markup).toBe(
      '<div>Erro ao carregar perfil. Tente novamente mais tarde.</div>'
    );
  });
});
