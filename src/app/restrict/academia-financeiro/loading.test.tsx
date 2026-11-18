import type { ReactNode } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';

vi.mock('@/_components/layout/defaultLayout', () => ({
  default: ({ children }: { children: ReactNode }) => <>{children}</>,
}));

import AcademiaFinanceiroLoading from './loading';

describe('academia-financeiro loading state', () => {
  it('UT-146 renders skeleton placeholders with aria-busy', () => {
    const html = renderToStaticMarkup(<AcademiaFinanceiroLoading />);

    expect(html).toContain('aria-busy="true"');
    expect(html).toContain('data-slot="skeleton"');
  });

  it('announces the loading in words and shows no figures', () => {
    const html = renderToStaticMarkup(<AcademiaFinanceiroLoading />);

    expect(html).toContain('Carregando o painel financeiro');
    expect(html).not.toContain('R$');
  });
});
