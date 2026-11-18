import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import BackofficeFinancialHealthLoading from './loading';

describe('backoffice financial health loading state', () => {
  it('UT-146 renders skeleton placeholders with aria-busy', () => {
    const html = renderToStaticMarkup(<BackofficeFinancialHealthLoading />);

    expect(html).toContain('aria-busy="true"');
    expect(html).toContain('data-slot="skeleton"');
  });

  it('announces the loading in words and shows no figures', () => {
    const html = renderToStaticMarkup(<BackofficeFinancialHealthLoading />);

    expect(html).toContain('Carregando o painel financeiro');
    expect(html).not.toContain('R$');
  });
});
