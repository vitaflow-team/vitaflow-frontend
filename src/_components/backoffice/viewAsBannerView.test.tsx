import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { ViewAsBannerView } from './viewAsBannerView';

describe('ViewAsBannerView — platform-admin-access US-004', () => {
  it('shows the target label and an exit control, persistently', () => {
    const html = renderToStaticMarkup(
      <ViewAsBannerView
        targetLabel="Diego Martins (Usuário)"
        exitControl={<button type="button">Encerrar</button>}
      />
    );

    expect(html).toContain('Diego Martins (Usuário)');
    expect(html).toContain('somente leitura');
    expect(html).toContain('Encerrar');
  });
});
