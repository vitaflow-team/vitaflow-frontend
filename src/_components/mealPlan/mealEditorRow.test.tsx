import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';
import { MealEditorRow } from './mealEditorRow';

describe('MealEditorRow', () => {
  it('shows the meal label and text in their fields', () => {
    const html = renderToStaticMarkup(
      <MealEditorRow
        meal={{ key: 'a', label: 'Almoço', text: 'Arroz e feijão' }}
        disabled={false}
        onChange={vi.fn()}
        onRemove={vi.fn()}
      />
    );
    expect(html).toContain('value="Almoço"');
    expect(html).toContain('Arroz e feijão');
  });

  it('disables both fields and the remove button while pending', () => {
    const html = renderToStaticMarkup(
      <MealEditorRow
        meal={{ key: 'a', label: '', text: '' }}
        disabled={true}
        onChange={vi.fn()}
        onRemove={vi.fn()}
      />
    );
    expect(html).toMatch(/<input[^>]*disabled=""/);
    expect(html).toMatch(/<button[^>]*disabled=""/);
  });
});
