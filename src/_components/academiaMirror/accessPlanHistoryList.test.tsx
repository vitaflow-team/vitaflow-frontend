import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { AccessPlanHistoryList } from './accessPlanHistoryList';

describe('AccessPlanHistoryList', () => {
  // UT-023
  it('renders "Nenhum plano anterior" for an empty history, not an empty list', () => {
    const html = renderToStaticMarkup(<AccessPlanHistoryList history={[]} />);

    expect(html).toContain('Nenhum plano anterior.');
    expect(html).not.toContain('<ul');
  });

  it('renders each archived plan with name, validity and date range', () => {
    const html = renderToStaticMarkup(
      <AccessPlanHistoryList
        history={[
          {
            id: 'plan-1',
            planName: 'Mensal',
            validityType: 'DAYS',
            validityValue: 30,
            assignedAt: '2026-09-01T00:00:00.000Z',
            endedAt: '2026-10-01T00:00:00.000Z',
          },
        ]}
      />
    );

    expect(html).toContain('Mensal');
    expect(html).toContain('30 dias');
  });
});
