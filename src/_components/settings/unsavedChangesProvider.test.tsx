import {
  UnsavedChangesProvider,
  useUnsavedChanges,
} from '@/_components/settings/unsavedChangesProvider';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';

vi.mock('next/navigation', () => ({
  useRouter: () => ({ refresh: vi.fn(), push: vi.fn() }),
}));

/** Reads the context the way the profile form does. */
function DirtyProbe() {
  const { setDirty } = useUnsavedChanges();
  return <span data-probe={typeof setDirty} />;
}

/** Renders the probe with no provider around it. */
function renderWithoutProvider(): string {
  return renderToStaticMarkup(<DirtyProbe />);
}

describe('test coverage — unsaved changes provider', () => {
  // UT-011
  it('renders its children and no discard dialog while nothing is pending', () => {
    const html = renderToStaticMarkup(
      <UnsavedChangesProvider>
        <p>Formulário de perfil</p>
      </UnsavedChangesProvider>
    );

    expect(html).toContain('<p>Formulário de perfil</p>');
    expect(html).not.toContain('Você tem alterações não salvas');
    expect(html).not.toContain('Descartar alterações');
  });

  // UT-011
  it('hands the dirty flag setter to the form inside it', () => {
    const html = renderToStaticMarkup(
      <UnsavedChangesProvider>
        <DirtyProbe />
      </UnsavedChangesProvider>
    );

    expect(html).toContain('data-probe="function"');
  });

  // UT-011
  it('refuses to be read outside the provider', () => {
    expect(renderWithoutProvider).toThrow(
      'useUnsavedChanges precisa estar dentro de UnsavedChangesProvider'
    );
  });
});
