import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { PanelNotice } from './panelNotice';

describe('PanelNotice', () => {
  it('shows the message as text, as a status by default', () => {
    const html = renderToStaticMarkup(<PanelNotice message="Tudo certo." />);

    expect(html).toContain('role="status"');
    expect(html).toContain('Tudo certo.');
    expect(html).not.toContain('<a ');
  });

  it('announces itself as an alert only when asked', () => {
    const html = renderToStaticMarkup(
      <PanelNotice message="Erro" role="alert" />
    );

    expect(html).toContain('role="alert"');
  });

  it('adds an action link only when it has both an address and a label', () => {
    const complete = renderToStaticMarkup(
      <PanelNotice message="Ação" actionHref="/x" actionLabel="Ir" />
    );
    const partial = renderToStaticMarkup(
      <PanelNotice message="Ação" actionHref="/x" />
    );

    expect(complete).toContain('href="/x"');
    expect(complete).toContain('>Ir</a>');
    expect(partial).not.toContain('<a ');
  });
});
