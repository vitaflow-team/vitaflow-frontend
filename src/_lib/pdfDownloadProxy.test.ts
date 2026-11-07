import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const { cookieGetMock, cookiesMock } = vi.hoisted(() => ({
  cookieGetMock: vi.fn(),
  cookiesMock: vi.fn(),
}));

vi.mock('next/headers', () => ({
  cookies: cookiesMock,
}));

vi.mock('./env', () => ({
  env: {
    BACKEND_URL: 'https://backend.example.test',
    APP_SECRET_KEY: 'application-secret',
  },
}));

import { proxyPdfDownload } from './pdfDownloadProxy';

describe('proxyPdfDownload — pdf-export task_02', () => {
  beforeEach(() => {
    cookiesMock.mockResolvedValue({ get: cookieGetMock });
    cookieGetMock.mockReset();
    cookieGetMock.mockReturnValue({
      name: 'vf_access_token',
      value: 'backend-secret',
    });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    cookiesMock.mockReset();
  });

  it('UT-031 passes through a successful PDF response unchanged', async () => {
    const pdfBytes = '%PDF-1.4 fake pdf body';
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(
        new Response(pdfBytes, {
          status: 200,
          headers: {
            'Content-Type': 'application/pdf',
            'Content-Disposition': 'attachment; filename="plano-alimentar.pdf"',
          },
        })
      )
    );

    const response = await proxyPdfDownload(
      '/professionals/clients/c1/meal-plan/draft/pdf'
    );

    expect(response.status).toBe(200);
    expect(response.headers.get('Content-Type')).toBe('application/pdf');
    expect(response.headers.get('Content-Disposition')).toBe(
      'attachment; filename="plano-alimentar.pdf"'
    );
    await expect(response.text()).resolves.toBe(pdfBytes);

    const [url, init] = vi.mocked(fetch).mock.calls[0];
    expect(url).toBe(
      'https://backend.example.test/professionals/clients/c1/meal-plan/draft/pdf'
    );
    expect(new Headers(init?.headers).get('Authorization')).toBe(
      'Bearer backend-secret'
    );
    expect(new Headers(init?.headers).get('x-application-secret')).toBe(
      'application-secret'
    );
  });

  it('UT-032 relays a 403 from the backend rather than masking it as a 500', async () => {
    const body = JSON.stringify({ message: 'Forbidden', code: 'forbidden' });
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(
        new Response(body, {
          status: 403,
          headers: { 'Content-Type': 'application/json' },
        })
      )
    );

    const response = await proxyPdfDownload(
      '/professionals/clients/c1/meal-plan/draft/pdf'
    );

    expect(response.status).toBe(403);
    await expect(response.text()).resolves.toBe(body);
  });

  it('UT-033 relays a 404 from the backend unchanged', async () => {
    const body = JSON.stringify({ message: 'Not found' });
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(
        new Response(body, {
          status: 404,
          headers: { 'Content-Type': 'application/json' },
        })
      )
    );

    const response = await proxyPdfDownload('/workouts/current/pdf');

    expect(response.status).toBe(404);
    await expect(response.text()).resolves.toBe(body);
  });

  it('omits Authorization when no access-token cookie is present', async () => {
    cookieGetMock.mockReturnValue(undefined);
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(new Response('%PDF', { status: 200 }))
    );

    await proxyPdfDownload('/workouts/current/pdf');

    const [, init] = vi.mocked(fetch).mock.calls[0];
    expect(new Headers(init?.headers).has('Authorization')).toBe(false);
  });
});
