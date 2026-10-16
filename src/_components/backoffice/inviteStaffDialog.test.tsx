import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';

vi.mock('zsa-react', () => ({
  useServerAction: () => ({ isPending: false, execute: vi.fn() }),
}));
vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn(), refresh: vi.fn() }),
}));
vi.mock('@/_hooks/alertHook', () => ({
  useAlertHook: () => ({ openError: vi.fn() }),
}));
vi.mock('@/_actions/backoffice/inviteStaff', () => ({ inviteStaff: {} }));

import { InviteStaffDialog } from './inviteStaffDialog';

describe('InviteStaffDialog — platform-admin-access US-007', () => {
  it('shows the invite trigger before the dialog is opened', () => {
    const html = renderToStaticMarkup(<InviteStaffDialog />);

    expect(html).toContain('Convidar membro');
  });
});
