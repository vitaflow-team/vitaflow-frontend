import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { DelinquentRow } from './delinquentRow';

const ROW = {
  clientId: 'c1',
  name: 'Ana Souza',
  totalOwedCents: 45000,
  overdueCount: 3,
  oldestDaysOverdue: 12,
};

function render(row = ROW) {
  return renderToStaticMarkup(
    <ul>
      <DelinquentRow
        row={row}
        href="/restrict/students/c1/billing"
        overdueColumn="Cobranças em atraso"
      />
    </ul>
  );
}

describe('DelinquentRow', () => {
  it('has one link, on the name, to the given billing area', () => {
    const html = render();

    expect(html.match(/<a /g)).toHaveLength(1);
    expect(html).toContain('href="/restrict/students/c1/billing"');
    expect(html).toContain('>Ana Souza</a>');
  });

  it('labels every figure and shows only the allowed fields', () => {
    const html = render();

    expect(html).toContain('>Total devido</dt><dd');
    expect(html).toContain('R$ 450,00');
    expect(html).toContain('>Cobranças em atraso</dt><dd');
    expect(html).toContain('>3</dd>');
    expect(html).toContain('>Atraso mais antigo</dt><dd');
    expect(html).toContain('>12 dias</dd>');
    expect(html).not.toContain('c1</');
  });

  it('keeps the full name in title and truncates it visually', () => {
    const html = render({ ...ROW, name: 'Maria '.repeat(40).trim() });

    expect(html).toContain(`title="${'Maria '.repeat(40).trim()}"`);
    expect(html).toContain('truncate');
  });
});
