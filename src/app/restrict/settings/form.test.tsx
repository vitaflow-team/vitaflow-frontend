import type { FormSettingsProfile } from '@/_types/formSettingsProfile';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';
import FormSettings from './form';

vi.mock('@/_actions/users/postChangeProfile', () => ({
  actionChangeProfile: vi.fn(),
}));
vi.mock('@/_hooks/alertHook', () => ({
  useAlertHook: () => ({ openError: vi.fn() }),
}));
vi.mock('next/navigation', () => ({
  useRouter: () => ({ refresh: vi.fn(), push: vi.fn() }),
}));
vi.mock('@/_components/settings/unsavedChangesProvider', () => ({
  useUnsavedChanges: () => ({ setDirty: vi.fn() }),
}));

const PROFILE: FormSettingsProfile = {
  name: 'Ana Souza',
  email: 'ana@example.test',
  phone: '(41) 99999-0000',
  birthDate: '1990-05-01T00:00:00.000Z',
  avatar: null,
  address: {
    addressLine1: 'Rua das Flores, 10',
    addressLine2: 'Apto 2',
    district: 'Centro',
    city: 'Curitiba',
    region: 'PR',
    postalCode: '80000-000',
  },
};

describe('refactor — composed FormSettings', () => {
  // UT-006
  it('composes the three cards with the saved profile values', () => {
    const markup = renderToStaticMarkup(<FormSettings profile={PROFILE} />);

    expect(markup).toContain('Dados pessoais');
    expect(markup).toContain('Endereço');
    expect(markup).toContain('Foto de perfil');
    expect(markup).toContain('value="Ana Souza"');
    expect(markup).toContain('value="1990-05-01"');
    expect(markup).toContain('value="Curitiba"');
  });

  // UT-006
  it('keeps the save bar and its spacer hidden on a clean form', () => {
    const markup = renderToStaticMarkup(<FormSettings profile={PROFILE} />);

    expect(markup).not.toContain('Não salvo');
    expect(markup).not.toContain('h-28 md:h-20');
  });
});
