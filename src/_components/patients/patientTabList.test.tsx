import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { PatientTabList } from './patientTabList';

describe('patient tab list', () => {
  it('UT-129 includes Cadastro and Cobranças alongside the existing tabs', () => {
    const html = renderToStaticMarkup(
      <PatientTabList patientId="p1" selected="overview" />
    );

    expect(html).toContain('Cadastro');
    expect(html).toContain('Cobranças');
    expect(html).toContain('Visão geral');
    expect(html).toContain('Anamnese');
    expect(html.match(/role="tab"/g)).toHaveLength(7);
  });

  it('marks the Cobranças tab as selected and keyboard-reachable', () => {
    const html = renderToStaticMarkup(
      <PatientTabList patientId="p1" selected="cobranca" />
    );

    expect(html).toContain('href="/restrict/patients/p1/cobranca"');
    expect(html.match(/tabIndex="0"|tabindex="0"/g)).toHaveLength(1);
  });
});
