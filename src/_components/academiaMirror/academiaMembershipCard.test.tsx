import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import type { AcademiaMembership } from '@/_types/academiaMirror';
import { AcademiaMembershipCard } from './academiaMembershipCard';

function makeMembership(
  overrides: Partial<AcademiaMembership> = {}
): AcademiaMembership {
  return {
    academiaId: 'academia-1',
    academiaName: 'Academia Vitória',
    currentPlan: {
      status: 'NO_PLAN',
      planName: null,
      validityType: null,
      validityValue: null,
      remaining: null,
    },
    history: [],
    ...overrides,
  };
}

describe('AcademiaMembershipCard', () => {
  // UT-021
  it('shows the Válido badge and the remaining count for a valid plan', () => {
    const html = renderToStaticMarkup(
      <AcademiaMembershipCard
        membership={makeMembership({
          currentPlan: {
            status: 'VALID',
            planName: 'Mensal',
            validityType: 'DAYS',
            validityValue: 30,
            remaining: 5,
          },
        })}
      />
    );

    expect(html).toContain('Válido');
    expect(html).toContain('5 dia(s) restante(s)');
    expect(html).toContain('Academia Vitória');
  });

  // UT-022
  it('shows Sem plano ativo with no remaining count and no link or button', () => {
    const html = renderToStaticMarkup(
      <AcademiaMembershipCard membership={makeMembership()} />
    );

    expect(html).toContain('Sem plano ativo');
    expect(html).not.toContain('restante');
    expect(html).not.toContain('<a ');
    expect(html).not.toContain('<button');
  });

  it('shows Plano vencido and Visitas esgotadas with no call-to-action either', () => {
    const expired = renderToStaticMarkup(
      <AcademiaMembershipCard
        membership={makeMembership({
          currentPlan: {
            status: 'EXPIRED',
            planName: 'Mensal',
            validityType: 'DAYS',
            validityValue: 30,
            remaining: null,
          },
        })}
      />
    );
    expect(expired).toContain('Plano vencido');
    expect(expired).not.toContain('<a ');
    expect(expired).not.toContain('<button');

    const exhausted = renderToStaticMarkup(
      <AcademiaMembershipCard
        membership={makeMembership({
          currentPlan: {
            status: 'EXHAUSTED',
            planName: '10 acessos',
            validityType: 'VISITS',
            validityValue: 10,
            remaining: null,
          },
        })}
      />
    );
    expect(exhausted).toContain('Visitas esgotadas');
    expect(exhausted).not.toContain('<a ');
    expect(exhausted).not.toContain('<button');
  });
});
