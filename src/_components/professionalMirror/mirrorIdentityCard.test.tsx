import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { MirrorIdentityCard } from './mirrorIdentityCard';

describe('MirrorIdentityCard', () => {
  // US-001.AC-1
  it('shows the linked professional’s real name and specialty', () => {
    const html = renderToStaticMarkup(
      <MirrorIdentityCard
        professional={{
          id: 'p1',
          name: 'Dra. Ana',
          specialty: 'Nutrição esportiva',
        }}
        type="NUTRITIONIST"
      />
    );

    expect(html).toContain('Dra. Ana');
    expect(html).toContain('Nutrição esportiva');
    expect(html).toContain('Nutricionista');
  });

  it('falls back when the professional never set a specialty', () => {
    const html = renderToStaticMarkup(
      <MirrorIdentityCard
        professional={{ id: 'p1', name: 'Prof. Bruno', specialty: null }}
        type="PHYSICAL_EDUCATOR"
      />
    );

    expect(html).toContain('Especialidade não informada');
    expect(html).toContain('Educador físico');
  });
});
