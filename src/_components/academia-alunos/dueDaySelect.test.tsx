import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { DueDaySelect } from './dueDaySelect';

function optionValues(html: string): string[] {
  return [...html.matchAll(/<option value="([^"]*)"/g)].map(match => match[1]);
}

describe('DueDaySelect', () => {
  it('UT-141 offers exactly the days 1 to 28, labelled', () => {
    const html = renderToStaticMarkup(
      <DueDaySelect
        id="due"
        label="Dia de vencimento"
        value={10}
        onChange={() => {}}
      />
    );

    const values = optionValues(html);
    expect(values).toHaveLength(28);
    expect(values[0]).toBe('1');
    expect(values[27]).toBe('28');
    expect(values).not.toContain('29');
    expect(values).not.toContain('31');
    expect(html).toContain('<label for="due"');
    expect(html).toContain('Dia de vencimento');
  });

  it('selects the given day', () => {
    const html = renderToStaticMarkup(
      <DueDaySelect id="due" label="Dia" value={17} onChange={() => {}} />
    );

    expect(html).toMatch(/<option value="17" selected="">/);
  });

  it('adds a leading "keep" option only when asked, for changes that may leave a term alone', () => {
    const html = renderToStaticMarkup(
      <DueDaySelect
        id="due"
        label="Novo dia"
        value={null}
        emptyLabel="Manter o atual"
        onChange={() => {}}
      />
    );

    const values = optionValues(html);
    expect(values).toHaveLength(29);
    expect(values[0]).toBe('');
    expect(html).toContain('Manter o atual');
  });
});
