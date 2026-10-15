import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';

vi.mock('zsa-react', () => ({
  useServerAction: () => ({
    isPending: false,
    isError: false,
    execute: vi.fn(),
  }),
}));
vi.mock('@/_actions/checkin/searchStudents', () => ({ searchStudents: {} }));
vi.mock('@/_actions/checkin/receptionistCheckIn', () => ({
  receptionistCheckIn: {},
}));

import { ReceptionistCheckinView } from './receptionistCheckinView';

describe('ReceptionistCheckinView — gym-checkin US-002, US-003', () => {
  it('shows the search field and button before any search runs', () => {
    const html = renderToStaticMarkup(<ReceptionistCheckinView />);

    expect(html).toContain('Buscar');
    expect(html).toContain('Nome do aluno');
  });
});
