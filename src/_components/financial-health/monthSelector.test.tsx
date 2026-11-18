import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { monthOptions } from '@/_lib/financialHealthParams';
import { MonthSelector } from './monthSelector';

const OPTIONS = monthOptions('2026-11-17');

function render(selected: string) {
  return renderToStaticMarkup(
    <MonthSelector
      path="/restrict/financeiro"
      selected={selected}
      options={OPTIONS}
    />
  );
}

describe('MonthSelector', () => {
  it('is a GET form to the panel with a labelled month select', () => {
    const html = render('2026-03');

    expect(html).toContain('method="get"');
    expect(html).toContain('action="/restrict/financeiro"');
    expect(html).toContain('<label for="financial-month"');
    expect(html).toContain('id="financial-month"');
    expect(html).toContain('name="month"');
    expect(html).toContain('type="submit"');
  });

  it('offers the current month and the 12 before it, marking the current one', () => {
    const html = render('2026-11');

    expect(html.match(/<option/g)).toHaveLength(13);
    expect(html).toContain('Novembro de 2026 (atual)');
    expect(html).toContain('value="2025-11"');
    expect(html).not.toContain('value="2026-12"');
    expect(html).not.toContain('value="2025-10"');
  });

  it('selects the month on screen', () => {
    expect(render('2026-03')).toMatch(/<option value="2026-03" selected/);
  });
});
