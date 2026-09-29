import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { AuthHeroPanel } from './authHeroPanel';

describe('refactor — AuthHeroPanel', () => {
  // UT-003
  it('shows the tinted photo, hidden below large screens, with its caption', () => {
    const markup = renderToStaticMarkup(<AuthHeroPanel caption="Olá" />);

    expect(markup).toContain('hidden lg:block');
    expect(markup).toContain(
      'alt="Itens de treino e acompanhamento nutricional'
    );
    expect(markup).toContain('grayscale contrast-125');
    expect(markup).toContain('mix-blend-color');
    expect(markup).toContain('>Olá</p>');
  });
});
