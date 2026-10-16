import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';

vi.mock('zsa-react', () => ({
  useServerAction: () => ({
    isPending: false,
    execute: vi.fn(),
  }),
}));
vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn(), refresh: vi.fn() }),
}));
vi.mock('@/_hooks/alertHook', () => ({
  useAlertHook: () => ({ openError: vi.fn() }),
}));
vi.mock('@/_actions/backoffice/startViewAs', () => ({ startViewAs: {} }));

import { ViewAsReasonDialog } from './viewAsReasonDialog';

describe('ViewAsReasonDialog — platform-admin-access US-003, US-003.EC-1', () => {
  it('shows the "ver como" trigger before any dialog is opened', () => {
    const html = renderToStaticMarkup(
      <ViewAsReasonDialog
        targetKind="USER"
        targetId="target-1"
        targetLabel="Diego Martins (Usuário)"
      />
    );

    expect(html).toContain('Ver como');
  });
});
