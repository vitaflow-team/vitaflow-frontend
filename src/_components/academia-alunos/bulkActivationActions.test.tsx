import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { BulkActivationActions } from './bulkActivationActions';

function render(overrides: {
  selectedCount?: number;
  busy?: boolean;
  running?: boolean;
}) {
  return renderToStaticMarkup(
    <BulkActivationActions
      dueDay={17}
      onDueDayChange={() => {}}
      selectedCount={overrides.selectedCount ?? 2}
      busy={overrides.busy ?? false}
      running={overrides.running ?? false}
      onRun={() => {}}
    />
  );
}

// The class list also holds `disabled:` utilities, so match the attribute itself.
const DISABLED_BUTTON = /<button[^>]*\sdisabled=""/;

describe('BulkActivationActions', () => {
  it('enables the button when students are selected', () => {
    const html = render({});

    expect(html).toContain('Ativar selecionados');
    expect(html).not.toMatch(DISABLED_BUTTON);
    expect(html).toMatch(/<option value="17" selected="">/);
  });

  it('disables the button with an empty selection', () => {
    expect(render({ selectedCount: 0 })).toMatch(DISABLED_BUTTON);
  });

  it('says it is working and marks the button busy while running', () => {
    const html = render({ busy: true, running: true });

    expect(html).toContain('Ativando…');
    expect(html).toContain('aria-busy="true"');
    expect(html).toMatch(DISABLED_BUTTON);
  });
});
