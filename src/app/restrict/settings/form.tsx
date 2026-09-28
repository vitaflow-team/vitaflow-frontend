'use client';

import { SaveBar } from '@/_components/settings/saveBar';
import { Form } from '@/_components/ui/form';
import { useProfileForm } from '@/_hooks/useProfileForm';
import type { FormSettingsProfile } from '@/_types/formSettingsProfile';
import { AddressFields } from './addressFields';
import { AvatarField } from './avatarField';
import { PersonalDataFields } from './personalDataFields';

interface FormSettingsProps {
  profile: FormSettingsProfile;
}

export default function FormSettings({ profile }: FormSettingsProps) {
  const form = useProfileForm(profile);

  return (
    <Form {...form.methods}>
      <form
        onSubmit={form.onSubmit}
        className="flex w-full flex-col gap-4 lg:flex-row"
      >
        <div className="grid w-full gap-4 lg:grid-cols-2">
          <PersonalDataFields disabled={form.isPending} />
          <AddressFields disabled={form.isPending} />
        </div>

        <AvatarField
          src={form.avatarSrc}
          name={profile.name}
          disabled={form.isPending}
          onSelect={form.selectAvatar}
        />

        {/* The bar floats over the content; this spacer keeps it from covering
            the last form fields (US-004.EC-5). */}
        {form.isDirty && <div aria-hidden className="h-28 md:h-20" />}

        <SaveBar
          visible={form.isDirty}
          isSaving={form.isPending}
          onDiscard={form.handleDiscard}
        />
      </form>
    </Form>
  );
}
