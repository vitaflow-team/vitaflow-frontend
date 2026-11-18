import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { EligibleSelectionBar } from './eligibleSelectionBar';

function render(disabled: boolean) {
  return renderToStaticMarkup(
    <EligibleSelectionBar
      selectedCount={3}
      total={450}
      disabled={disabled}
      onSelectAll={() => {}}
      onClear={() => {}}
    />
  );
}

describe('EligibleSelectionBar — financial-health US-015', () => {
  it('announces how many students are selected, politely', () => {
    const html = render(false);

    expect(html).toContain('3 de 450 selecionados');
    expect(html).toContain('aria-live="polite"');
  });

  it('offers select all and clear, and disables both while working', () => {
    const idle = render(false);
    const busy = render(true);

    expect(idle).toContain('Selecionar todos');
    expect(idle).toContain('Limpar');
    expect(idle.match(/\sdisabled=""/g)).toBeNull();
    expect(busy.match(/\sdisabled=""/g)).toHaveLength(2);
  });
});
