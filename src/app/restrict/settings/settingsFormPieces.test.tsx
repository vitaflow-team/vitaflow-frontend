import { Form } from '@/_components/ui/form';
import { toProfileFormValues } from '@/_lib/formSettingsProfile';
import type { profileFormData } from '@/_schema/profile';
import type { FormSettingsProfile } from '@/_types/formSettingsProfile';
import type { ReactNode } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { useForm } from 'react-hook-form';
import { describe, expect, it } from 'vitest';
import { AddressFields } from './addressFields';
import { AvatarField } from './avatarField';
import { PersonalDataFields } from './personalDataFields';
import { ProfileTextField } from './profileTextField';

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

const EMPTY_PROFILE = {
  name: '',
  email: '',
  address: null,
} as unknown as FormSettingsProfile;

function Harness({
  profile = PROFILE,
  children,
}: {
  profile?: FormSettingsProfile;
  children: ReactNode;
}) {
  const methods = useForm<profileFormData>({
    defaultValues: toProfileFormValues(profile),
  });
  return (
    <Form {...methods}>
      <form>{children}</form>
    </Form>
  );
}

function render(node: ReactNode, profile?: FormSettingsProfile) {
  return renderToStaticMarkup(<Harness profile={profile}>{node}</Harness>);
}

describe('refactor — settings form text field', () => {
  // UT-002
  it('renders a labelled input bound to its field', () => {
    const markup = render(
      <ProfileTextField
        name="address.city"
        label="Cidade"
        id="city"
        disabled={false}
      />
    );

    expect(markup).toContain('Cidade');
    expect(markup).toContain('name="address.city"');
    expect(markup).toContain('value="Curitiba"');
  });

  // UT-002
  it('passes extra input attributes and dims a disabled field', () => {
    const markup = render(
      <ProfileTextField
        name="birthDate"
        label="Data de nascimento"
        id="birthDate"
        disabled
        type="date"
        max="2026-09-28"
      />
    );

    expect(markup).toContain('type="date"');
    expect(markup).toContain('max="2026-09-28"');
    expect(markup).toContain('value="1990-05-01"');
    expect(markup).toContain('opacity-60');
  });
});

describe('refactor — settings form cards', () => {
  // UT-002
  it('renders the personal data card with its four fields', () => {
    const markup = render(<PersonalDataFields disabled={false} />);

    expect(markup).toContain('Dados pessoais');
    for (const label of ['Nome', 'E-Mail', 'Data de nascimento', 'Telefone']) {
      expect(markup).toContain(label);
    }
    expect(markup).toContain('value="Ana Souza"');
    expect(markup).toContain('value="ana@example.test"');
    expect(markup).toContain('type="date"');
    expect(markup).toContain('value="(41) 99999-0000"');
  });

  // UT-002
  it('renders the address card with its six fields', () => {
    const markup = render(<AddressFields disabled={false} />);

    for (const label of ['Complemento', 'Bairro', 'CEP', 'Estado', 'Cidade']) {
      expect(markup).toContain(label);
    }
    expect(markup).toContain('name="address.addressLine1"');
    expect(markup).toContain('value="Rua das Flores, 10"');
    expect(markup).toContain('value="80000-000"');
    expect(markup).toContain('value="PR"');
  });

  // UT-005
  it('renders empty address fields when the profile has no address', () => {
    const markup = render(<AddressFields disabled={false} />, EMPTY_PROFILE);

    expect(markup).toContain('name="address.city"');
    expect(markup).not.toContain('value="Curitiba"');
    expect(markup.match(/value=""/g)).toHaveLength(6);
  });
});

describe('refactor — settings avatar field', () => {
  // UT-002
  it('renders the photo card with a hidden image picker and the swap button', () => {
    const markup = render(
      <AvatarField
        src="https://storage.example.test/avatar.png"
        name="Ana Souza"
        disabled={false}
        onSelect={() => {}}
      />
    );

    expect(markup).toContain('Foto de perfil');
    expect(markup).toContain('type="file"');
    expect(markup).toContain('accept="image/*"');
    expect(markup).toContain('Trocar foto');
    expect(markup).toContain('h-40 w-40');
  });

  // UT-005
  it('falls back to the initials without an avatar and disables while saving', () => {
    const markup = render(
      <AvatarField
        src={undefined}
        name="Ana Souza"
        disabled
        onSelect={() => {}}
      />
    );

    expect(markup).toContain('AS');
    expect(markup).toContain('disabled=""');
  });
});
