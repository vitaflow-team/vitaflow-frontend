import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { StudentResults } from './studentResults';

describe('StudentResults', () => {
  it('lists each student the search found', () => {
    const html = renderToStaticMarkup(
      <StudentResults
        results={[
          { id: 's1', name: 'Diego Martins' },
          { id: 's2', name: 'Fernanda Souza' },
        ]}
        onSelect={() => {}}
      />
    );

    expect(html.match(/<li>/g)).toHaveLength(2);
    expect(html).toContain('Diego Martins');
    expect(html).toContain('Fernanda Souza');
  });

  it('says in words that nothing was found', () => {
    const html = renderToStaticMarkup(
      <StudentResults results={[]} onSelect={() => {}} />
    );

    expect(html).toContain('Nenhum resultado.');
    expect(html).not.toContain('<ul');
  });
});
