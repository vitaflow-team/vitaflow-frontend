import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { PlatformDelinquentsSection } from './platformDelinquentsSection';

const PAGE = {
  tier: 'EQUIPE' as const,
  bandCounts: { d1to7: 1, d8to30: 0, d31Plus: 0 },
  items: [
    {
      userId: 'u1',
      name: 'Ana Souza',
      accountType: 'USER' as const,
      planName: 'Premium',
      totalOwedCents: 9990,
      oldestDaysOverdue: 12,
    },
  ],
  page: 1,
  pageSize: 20,
  total: 1,
};

const PATH = '/restrict/backoffice/financial-health';

describe('PlatformDelinquentsSection', () => {
  it('titles the list and describes what the total adds up', () => {
    const html = renderToStaticMarkup(
      <PlatformDelinquentsSection
        delinquents={PAGE}
        path={PATH}
        query={{ month: '2026-11', page: 1 }}
      />
    );

    expect(html).toContain('Assinantes inadimplentes');
    expect(html).toContain('só o que está em atraso');
    expect(html).toContain('Ana Souza');
    expect(html).not.toContain('Paginação');
  });

  it('pages 20 at a time with accessible links that keep the month', () => {
    const html = renderToStaticMarkup(
      <PlatformDelinquentsSection
        delinquents={{ ...PAGE, page: 2, total: 45 }}
        path={PATH}
        query={{ month: '2026-09', page: 2 }}
      />
    );

    expect(html).toContain('aria-label="Paginação da lista de inadimplentes"');
    expect(html).toContain('aria-current="page"');
    expect(html).toContain(`href="${PATH}?month=2026-09#inadimplentes"`);
  });
});
