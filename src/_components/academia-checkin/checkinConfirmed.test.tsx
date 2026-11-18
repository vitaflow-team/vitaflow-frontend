import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { CheckinConfirmed } from './checkinConfirmed';

describe('CheckinConfirmed — financial-health US-019', () => {
  it('UT-138 puts the neutral notice in its own role="status" element next to the confirmation', () => {
    const html = renderToStaticMarkup(
      <CheckinConfirmed
        confirmation={{
          createdAt: '2026-11-17T14:30:00.000Z',
          notice: 'SEE_ADMINISTRATION',
        }}
        onReset={() => {}}
      />
    );

    expect(html.match(/role="status"/g)).toHaveLength(2);
    expect(html).toContain('Check-in registrado às');
    expect(html).toContain('Oriente o aluno a passar pela administração.');
  });

  it('UT-138 shows no extra message without a notice', () => {
    const html = renderToStaticMarkup(
      <CheckinConfirmed
        confirmation={{ createdAt: '2026-11-17T14:30:00.000Z', notice: null }}
        onReset={() => {}}
      />
    );

    expect(html.match(/role="status"/g)).toHaveLength(1);
    expect(html).not.toContain('administração');
  });
});
