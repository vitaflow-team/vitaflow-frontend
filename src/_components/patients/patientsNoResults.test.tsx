import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { PatientsNoResults } from './patientsNoResults';

describe('PatientsNoResults', () => {
  it('shows the searched term as plain text, never markup', () => {
    const html = renderToStaticMarkup(
      <PatientsNoResults search="<b>ana</b>" />
    );
    expect(html).toContain('&lt;b&gt;ana&lt;/b&gt;');
    expect(html).not.toContain('<b>ana</b>');
  });

  it('offers a link that clears the search', () => {
    const html = renderToStaticMarkup(<PatientsNoResults search="zzz" />);
    expect(html).toContain('href="/restrict/patients"');
    expect(html).toContain('Limpar busca');
  });
});
