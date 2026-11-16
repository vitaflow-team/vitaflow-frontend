import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { AiExplanationPanel } from './aiExplanationPanel';

describe('AiExplanationPanel', () => {
  // UT-023
  it('renders the explanation when present', () => {
    const html = renderToStaticMarkup(
      <AiExplanationPanel explanation="Plano equilibrado para o objetivo." />
    );

    expect(html).toContain('Plano equilibrado para o objetivo.');
  });

  it('renders nothing when the explanation is null', () => {
    const html = renderToStaticMarkup(
      <AiExplanationPanel explanation={null} />
    );

    expect(html).toBe('');
  });

  it('renders nothing when the explanation is undefined', () => {
    const html = renderToStaticMarkup(
      <AiExplanationPanel explanation={undefined} />
    );

    expect(html).toBe('');
  });
});
