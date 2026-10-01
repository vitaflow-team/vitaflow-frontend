import { Receipt } from 'lucide-react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { MirrorSectionCard } from './mirrorSectionCard';

describe('MirrorSectionCard', () => {
  // US-002.AC-1
  it('shows the title and an explicit empty-state message, never a blank area', () => {
    const html = renderToStaticMarkup(
      <MirrorSectionCard
        title="Cobrança"
        icon={Receipt}
        emptyMessage="Nenhuma cobrança configurada ainda."
      />
    );

    expect(html).toContain('Cobrança');
    expect(html).toContain('Nenhuma cobrança configurada ainda.');
  });
});
