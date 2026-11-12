import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { NoAcademiaMembershipState } from './noAcademiaMembershipState';

describe('NoAcademiaMembershipState', () => {
  // UT-024
  it('renders only the empty-state message, no link or button', () => {
    const html = renderToStaticMarkup(<NoAcademiaMembershipState />);

    expect(html).toContain('Você ainda não é aluno de nenhuma academia.');
    expect(html).not.toContain('<a ');
    expect(html).not.toContain('<button');
  });
});
