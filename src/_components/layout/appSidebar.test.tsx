import { AppSidebar } from '@/_components/layout/appSidebar';
import { SidebarProvider } from '@/_components/ui/sidebar';
import { getPlanSummary } from '@/_lib/planSummary';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';

const { pathnameMock } = vi.hoisted(() => ({
  pathnameMock: vi.fn(() => '/restrict'),
}));

vi.mock('next/navigation', () => ({
  usePathname: pathnameMock,
  useRouter: () => ({ refresh: vi.fn(), push: vi.fn() }),
}));
vi.mock('next-auth/react', () => ({ signOut: vi.fn() }));

function render(productType: string | null, pathname: string): string {
  pathnameMock.mockReturnValue(pathname);
  return renderToStaticMarkup(
    <SidebarProvider>
      <AppSidebar
        productType={productType}
        firstName="Ana"
        avatar={null}
        plan={getPlanSummary(null)}
      />
    </SidebarProvider>
  );
}

function text(html: string): string {
  return html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ');
}

describe('test coverage — app sidebar', () => {
  // UT-011
  it('lists the sections a personal account sees, grouped', () => {
    const html = render('USER', '/restrict');
    const body = text(html);

    expect(html).toContain('aria-label="Menu principal"');
    expect(body).toContain('Meu dia');
    expect(body).toContain('Conta');
    expect(body).toContain('Início');
    expect(body).toContain('Treinos');
    expect(body).toContain('Minha evolução');
    expect(body).toContain('Configurações');
    expect(body).not.toContain('Pessoas');
  });

  // UT-011
  it('adds the clients section for a professional', () => {
    const body = text(render('NUTRITIONIST', '/restrict'));

    expect(body).toContain('Pessoas');
  });

  // UT-011
  it('marks only the section of the current path as the current page', () => {
    const html = render('NUTRITIONIST', '/restrict/clients/0199a1b2');
    // Whole opening tags, so the check does not depend on attribute order.
    const currentLinks = html.match(/<a [^>]*aria-current="page"[^>]*>/g);

    expect(currentLinks).toHaveLength(1);
    expect(currentLinks?.[0]).toContain('href="/restrict/clients"');
  });

  // UT-011
  it('keeps the brand, the collapsed monogram and the user in the footer', () => {
    const html = render('USER', '/restrict');
    const body = text(html);

    expect(body).toContain('VF');
    expect(body).toContain('Vita Flow');
    expect(body).toContain('Ana');
  });
});
