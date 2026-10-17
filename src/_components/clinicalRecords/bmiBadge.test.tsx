import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { BmiBadge } from './bmiBadge';

describe('BmiBadge', () => {
  it('shows the value and classification when derived', () => {
    const html = renderToStaticMarkup(
      <BmiBadge bmi={{ value: 22.9, classification: 'PESO_NORMAL' }} />
    );
    expect(html).toContain('22,9');
    expect(html).toContain('Peso normal');
  });

  it('renders nothing when no BMI was derived (US-006.AC-2)', () => {
    const html = renderToStaticMarkup(<BmiBadge bmi={null} />);
    expect(html).toBe('');
  });
});
