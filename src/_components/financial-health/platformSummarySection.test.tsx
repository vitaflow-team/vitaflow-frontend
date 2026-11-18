import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';

vi.mock('./platformSummaryBody', () => ({
  PlatformSummaryBody: () => <p>corpo do resumo</p>,
}));

import { PlatformSummarySection } from './platformSummarySection';

const PATH = '/restrict/backoffice/financial-health';
const QUERY = { month: '2026-09', page: 1 };

function render(
  summary: Parameters<typeof PlatformSummarySection>[0]['summary']
) {
  return renderToStaticMarkup(
    <PlatformSummarySection
      summary={summary}
      path={PATH}
      query={QUERY}
      today="2026-11-17"
    />
  );
}

describe('PlatformSummarySection', () => {
  it('renders nothing when the summary was not requested (not the ADMIN tier)', () => {
    expect(render(null)).toBe('');
  });

  it('offers the month selector on the chosen month, then the summary', () => {
    const html = render({
      month: '2026-09',
    } as unknown as Parameters<typeof PlatformSummarySection>[0]['summary']);

    expect(html).toContain('id="financial-month"');
    expect(html).toMatch(/<option value="2026-09" selected="">/);
    expect(html).toContain('corpo do resumo');
  });

  it('says the summary could not be loaded, keeping the selector, with a retry on the same month', () => {
    const html = render('failed');

    expect(html).toContain('id="financial-month"');
    expect(html).toContain('Não foi possível carregar o resumo financeiro');
    expect(html).toContain(`href="${PATH}?month=2026-09"`);
    expect(html).not.toContain('corpo do resumo');
  });

  it('says access is denied, without a retry, when the tier changed meanwhile (IT-041)', () => {
    const html = render('forbidden');

    expect(html).toContain('Você não tem acesso a esta área.');
    expect(html).not.toContain('Tentar novamente');
  });
});
