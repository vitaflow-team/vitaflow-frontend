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
vi.mock('@/_actions/backoffice/endViewAs', () => ({ endViewAs: {} }));

import { EndViewAsButton } from './endViewAsButton';

describe('EndViewAsButton — platform-admin-access US-006', () => {
  it('shows the manual exit control', () => {
    const html = renderToStaticMarkup(
      <EndViewAsButton sessionId="session-1" />
    );

    expect(html.replace(/&quot;/g, '"')).toContain('Encerrar "ver como"');
  });
});
