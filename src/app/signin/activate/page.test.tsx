import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { renderToStaticMarkup } from 'react-dom/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const { apiClientMock } = vi.hoisted(() => ({ apiClientMock: vi.fn() }));

vi.mock('@/_lib/apiClient', () => ({ apiClient: apiClientMock }));
vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn(), refresh: vi.fn() }),
}));

import ActivatePage from './page';

async function renderPage(token?: string | string[]): Promise<string> {
  const page = await ActivatePage({ searchParams: Promise.resolve({ token }) });
  return renderToStaticMarkup(page);
}

describe('platform hardening — activation page', () => {
  beforeEach(() => {
    apiClientMock.mockReset();
  });

  it('UT-010 renders a confirmation without calling the backend', async () => {
    const html = await renderPage('raw-token');

    expect(apiClientMock).not.toHaveBeenCalled();
    expect(html).toContain('Ativar minha conta');
    expect(html).not.toContain('Bem-vindo!');
  });

  it('UT-010 shows the failure view for a link without a token', async () => {
    const html = await renderPage();

    expect(apiClientMock).not.toHaveBeenCalled();
    expect(html).toContain('Erro ao ativar sua conta.');
    expect(html).not.toContain('Ativar minha conta');
  });

  it('UT-010 leaves the activate endpoint to the Server Action alone', () => {
    const read = (file: string) => readFileSync(join(__dirname, file), 'utf8');

    for (const file of [
      'page.tsx',
      'activateAccount.tsx',
      'activationViews.tsx',
    ]) {
      expect(read(file)).not.toContain('/users/activate');
      expect(read(file)).not.toContain('apiClient');
    }
  });
});
