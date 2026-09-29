import { RecordFormBmiStrip } from '@/_components/progress/recordFormBmiStrip';
import { getBmiPreview } from '@/_lib/bmi';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';

describe('refactor — RecordFormBmiStrip', () => {
  // UT-001
  it('shows the BMI value and badge with the classification tone', () => {
    const markup = renderToStaticMarkup(
      <RecordFormBmiStrip preview={getBmiPreview(82.4, 168)} />
    );

    expect(markup).toContain('aria-live="polite"');
    expect(markup).toContain('Prévia do IMC');
    expect(markup).toContain('29,2');
    expect(markup).not.toContain('bg-muted');
    expect(markup).not.toContain('Preencha peso e altura para calcular.');
  });

  // UT-005
  it('falls back to the muted prompt without a preview', () => {
    const markup = renderToStaticMarkup(<RecordFormBmiStrip preview={null} />);

    expect(markup).toContain('bg-muted');
    expect(markup).toContain('Preencha peso e altura para calcular.');
  });
});
