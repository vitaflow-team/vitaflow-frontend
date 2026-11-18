import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { FinancialPanelSkeleton } from './financialPanelSkeleton';

describe('FinancialPanelSkeleton', () => {
  it('UT-146 renders skeleton placeholders marked busy', () => {
    const html = renderToStaticMarkup(<FinancialPanelSkeleton />);

    expect(html).toContain('aria-busy="true"');
    expect(html).toContain('data-slot="skeleton"');
    expect(html).toContain('animate-pulse');
  });

  it('says in words that the panel is loading, for screen readers', () => {
    const html = renderToStaticMarkup(<FinancialPanelSkeleton />);

    expect(html).toContain('role="status"');
    expect(html).toContain('Carregando o painel financeiro');
  });

  it('shows no figures while loading', () => {
    expect(renderToStaticMarkup(<FinancialPanelSkeleton />)).not.toContain(
      'R$'
    );
  });
});
