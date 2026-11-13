import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { CohortRetentionGrid } from './cohortRetentionGrid';

describe('CohortRetentionGrid (cohort-ltv-analysis)', () => {
  // UT-021
  it('renders a not-yet-elapsed cell distinctly from an actual 0% cell', () => {
    const html = renderToStaticMarkup(
      <CohortRetentionGrid
        rowLabels={['Nov/2025']}
        columnCount={3}
        cells={[[0, 100, null]]}
      />
    );

    expect(html).toContain('Nov/2025');
    expect(html).toContain('0%');
    expect(html).toContain('100%');
    expect(html).toContain('border-dashed');
  });

  it('renders every elapsed-month column even when a row has fewer cells than columnCount', () => {
    const html = renderToStaticMarkup(
      <CohortRetentionGrid
        rowLabels={['Out/2025']}
        columnCount={2}
        cells={[]}
      />
    );

    expect(html).toContain('Out/2025');
    expect(html).toContain('border-dashed');
  });
});
