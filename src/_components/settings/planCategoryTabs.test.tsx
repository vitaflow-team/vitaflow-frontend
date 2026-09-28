import {
  PlanCategoryTabs,
  planCategoryTabId,
} from '@/_components/settings/planCategoryTabs';
import type { PlanCategoryKey } from '@/_lib/planCategories';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';

const PANELS = {
  usuario: <p>Planos de usuário</p>,
  nutricionista: <p>Planos de nutricionista</p>,
  'educador-fisico': <p>Planos de educador físico</p>,
};

function render(initial: PlanCategoryKey): string {
  return renderToStaticMarkup(
    <PlanCategoryTabs initial={initial} panels={PANELS} />
  );
}

describe('test coverage — plan category tabs', () => {
  // UT-011
  it('selects only the initial category and shows its panel alone', () => {
    const html = render('nutricionista');

    expect(html.match(/role="tab"/g)).toHaveLength(3);
    expect(html.match(/aria-selected="true"/g)).toHaveLength(1);
    expect(html).toContain(
      'id="plan-category-tab-nutricionista" aria-selected="true" aria-controls="plan-category-panel" tabindex="0"'
    );
    expect(html).toContain('Planos de nutricionista');
    expect(html).not.toContain('Planos de usuário');
    expect(html).not.toContain('Planos de educador físico');
  });

  // UT-011
  it('keeps unselected tabs out of the tab order', () => {
    const html = render('usuario');

    expect(html).toContain(
      'id="plan-category-tab-nutricionista" aria-selected="false" tabindex="-1"'
    );
    expect(html).toContain(
      'id="plan-category-tab-educador-fisico" aria-selected="false" tabindex="-1"'
    );
  });

  // UT-011
  it('labels the panel with the selected tab', () => {
    const html = render('educador-fisico');

    expect(html).toContain(
      `role="tabpanel" id="plan-category-panel" aria-labelledby="${planCategoryTabId('educador-fisico')}"`
    );
  });

  // UT-011
  it('offers the same choice as a labelled select on narrow screens', () => {
    const html = render('educador-fisico');

    expect(html).toContain('<label for="plan-category-select"');
    expect(html.match(/<option /g)).toHaveLength(3);
    expect(html).toContain('value="educador-fisico" selected=""');
  });
});
