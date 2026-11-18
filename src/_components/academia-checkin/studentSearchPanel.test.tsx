import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { StudentSearchPanel } from './studentSearchPanel';

function render(overrides: {
  results?: { id: string; name: string }[] | null;
  error?: string | null;
}) {
  return renderToStaticMarkup(
    <StudentSearchPanel
      query="die"
      results={overrides.results ?? null}
      isPending={false}
      error={overrides.error ?? null}
      onQueryChange={() => {}}
      onSearch={() => {}}
      onSelect={() => {}}
    />
  );
}

describe('StudentSearchPanel', () => {
  it('shows the search field with what was typed and the search button', () => {
    const html = render({});

    expect(html).toContain('Check-in');
    expect(html).toContain('placeholder="Nome do aluno"');
    expect(html).toContain('value="die"');
    expect(html).toContain('Buscar');
  });

  it('shows no results area before the first search', () => {
    expect(render({})).not.toContain('Nenhum resultado');
    expect(render({})).not.toContain('<ul');
  });

  it('shows the students found, or that none were', () => {
    expect(
      render({ results: [{ id: 's1', name: 'Diego Martins' }] })
    ).toContain('Diego Martins');
    expect(render({ results: [] })).toContain('Nenhum resultado.');
  });

  it('shows a failed search as an alert', () => {
    expect(render({ error: 'Falhou' })).toContain('role="alert"');
  });
});
