'use client';

import { actionChangeProfile } from '@/_actions/users/postChangeProfile';
import { useUnsavedChanges } from '@/_components/settings/unsavedChangesProvider';
import { useAlertHook } from '@/_hooks/alertHook';
import { toProfileFormValues } from '@/_lib/formSettingsProfile';
import { profileFormData, profileSchema } from '@/_schema/profile';
import type { FormSettingsProfile } from '@/_types/formSettingsProfile';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useServerAction } from 'zsa-react';

function revokeAll(urls: string[]) {
  for (const url of urls) URL.revokeObjectURL(url);
}

/**
 * The Profile form is the only one that declares pending changes; leaving the
 * tab must drop the guard together with it (ADR-009).
 */
function useUnsavedGuard(isDirty: boolean) {
  const { setDirty } = useUnsavedChanges();

  useEffect(() => {
    setDirty(isDirty);
    return () => setDirty(false);
  }, [isDirty, setDirty]);
}

/** Saved avatar plus an unsaved local preview, revoking every preview URL on unmount. */
function useAvatarPreview(initialAvatar: string | null) {
  const [savedAvatar, setSavedAvatar] = useState<string | null>(initialAvatar);
  const [preview, setPreview] = useState<string | null>(null);
  const objectUrls = useRef<string[]>([]);

  useEffect(() => {
    const urls = objectUrls.current;
    return () => revokeAll(urls);
  }, []);

  function selectAvatar(file: File) {
    const url = URL.createObjectURL(file);
    objectUrls.current.push(url);
    setPreview(url);
  }

  function commitPreview() {
    if (preview) setSavedAvatar(preview);
    setPreview(null);
  }

  return {
    avatarSrc: preview ?? savedAvatar ?? undefined,
    selectAvatar,
    discardPreview: () => setPreview(null),
    commitPreview,
  };
}

/** Runs the profile action, reporting failures and handing successes on. */
function useSaveProfile(onSaved: (data: profileFormData) => void) {
  const { isPending, execute } = useServerAction(actionChangeProfile);
  const { openError } = useAlertHook();

  async function submitProfile(data: profileFormData) {
    // Second lock against double clicks: the button is already disabled, but
    // a keyboard submit during the request would still reach this point.
    if (isPending) return;

    const [, error] = await execute(data);
    if (error) {
      // A failure keeps the bar and the edits: the user decides whether to retry.
      openError(
        error.message || 'Erro ao atualizar perfil.',
        'Atenção!',
        'error'
      );
      return;
    }

    onSaved(data);
  }

  return { isPending, submitProfile };
}

/** State and handlers behind `FormSettings`. */
export function useProfileForm(profile: FormSettingsProfile) {
  const router = useRouter();
  const [savedValues, setSavedValues] = useState<profileFormData>(() =>
    toProfileFormValues(profile)
  );
  const avatar = useAvatarPreview(profile.avatar ?? null);
  const { isPending, submitProfile } = useSaveProfile(applySaved);
  const methods = useForm<profileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: savedValues,
  });
  const isDirty = methods.formState.isDirty;
  useUnsavedGuard(isDirty);

  function applySaved(data: profileFormData) {
    const saved = { ...data, avatar: undefined };
    setSavedValues(saved);
    avatar.commitPreview();
    methods.reset(saved);
    // The top bar and the menu read the profile before this save.
    router.refresh();
  }

  function handleDiscard() {
    methods.reset(savedValues);
    avatar.discardPreview();
  }

  return {
    methods,
    isPending,
    isDirty,
    avatarSrc: avatar.avatarSrc,
    selectAvatar: avatar.selectAvatar,
    handleDiscard,
    onSubmit: methods.handleSubmit(submitProfile),
  };
}
