import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { CurrentPlanSummary } from './currentPlanSummary';

describe('CurrentPlanSummary', () => {
  it('says there is no plan', () => {
    const html = renderToStaticMarkup(
      <CurrentPlanSummary
        current={{ plan: null, status: 'NO_PLAN', remaining: null }}
      />
    );

    expect(html).toContain('Sem plano atribuído');
  });

  it('shows the expiry of a plan by days', () => {
    const html = renderToStaticMarkup(
      <CurrentPlanSummary
        current={{
          plan: {
            validityType: 'DAYS',
            validityValue: 30,
            expiresAt: '2026-12-10T12:00:00.000Z',
            assignedAt: '2026-11-10T12:00:00.000Z',
          },
          status: 'VALID',
          remaining: null,
        }}
      />
    );

    expect(html).toContain('Válido');
    expect(html).toContain('Expira em 10/12/2026');
  });

  it('shows the visits left of a plan by visits', () => {
    const html = renderToStaticMarkup(
      <CurrentPlanSummary
        current={{
          plan: {
            validityType: 'VISITS',
            validityValue: 10,
            expiresAt: null,
            assignedAt: '2026-11-10T12:00:00.000Z',
          },
          status: 'VALID',
          remaining: 4,
        }}
      />
    );

    expect(html).toContain('4 acessos restantes');
  });
});
