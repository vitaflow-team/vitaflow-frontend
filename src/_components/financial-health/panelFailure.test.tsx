import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import type { LoadFailure } from '@/_types/loadFailure';
import { PanelFailure } from './panelFailure';

function render(failure: LoadFailure) {
  return renderToStaticMarkup(
    <PanelFailure
      failure={failure}
      what="o painel financeiro"
      retryHref="/restrict/financeiro?month=2026-03"
    />
  );
}

describe('PanelFailure', () => {
  it('says access is denied and offers no retry on forbidden', () => {
    const html = render('forbidden');

    expect(html).toContain('Você não tem acesso a esta área.');
    expect(html).toContain('role="alert"');
    expect(html).not.toContain('<a ');
  });

  it('asks to try again, with a retry link, when the read failed', () => {
    const html = render('failed');

    expect(html).toContain('Não foi possível carregar o painel financeiro.');
    expect(html).toContain('href="/restrict/financeiro?month=2026-03"');
    expect(html).toContain('Tentar novamente');
    expect(html).not.toContain('R$');
  });

  it('says nothing was found on not-found, without a retry', () => {
    const html = render('not-found');

    expect(html).toContain('Não encontramos o painel financeiro.');
    expect(html).not.toContain('<a ');
  });
});
