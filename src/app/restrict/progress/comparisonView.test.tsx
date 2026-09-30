import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { ComparisonView } from './comparisonView';

describe('ComparisonView', () => {
  it('shows both photos with their dates side by side', () => {
    const markup = renderToStaticMarkup(
      <ComparisonView
        angle="FRONT"
        result={{
          a: {
            id: 'a',
            angle: 'FRONT',
            signedUrl: 'https://x/a.png',
            takenAt: '2026-01-01',
          },
          b: {
            id: 'b',
            angle: 'FRONT',
            signedUrl: 'https://x/b.png',
            takenAt: '2026-02-01',
          },
        }}
      />
    );

    expect(markup).toContain('a.png');
    expect(markup).toContain('b.png');
    expect(markup).toContain('/restrict/progress?tab=fotos&amp;angle=FRONT');
  });
});
