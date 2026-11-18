import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { DelinquentFigure } from './delinquentFigure';

describe('DelinquentFigure', () => {
  it('reads as a term and its value', () => {
    const html = renderToStaticMarkup(
      <dl>
        <DelinquentFigure label="Total devido" value="R$ 450,00" />
      </dl>
    );

    expect(html).toContain('<dt');
    expect(html).toContain('Total devido');
    expect(html).toContain('<dd');
    expect(html).toContain('R$ 450,00');
  });
});
