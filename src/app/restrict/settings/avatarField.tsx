'use client';

import { UserAvatar } from '@/_components/layout/userAvatar';
import { Button } from '@/_components/ui/button';
import { Card, CardTitle } from '@/_components/ui/card';
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/_components/ui/form';
import type { profileFormData } from '@/_schema/profile';
import { useRef } from 'react';
import { useFormContext } from 'react-hook-form';

interface AvatarPickerProps {
  src: string | undefined;
  name: string;
  disabled: boolean;
  onPick: (file: File) => void;
}

/** Avatar (or preview) and a hidden file input opened by the swap button. */
export function AvatarPicker({
  src,
  name,
  disabled,
  onPick,
}: AvatarPickerProps) {
  const fileRef = useRef<HTMLInputElement>(null);

  return (
    <>
      <input
        type="file"
        accept="image/*"
        className="hidden"
        ref={fileRef}
        disabled={disabled}
        onChange={event => {
          const file = event.target.files?.[0];
          if (!file) return;
          onPick(file);
          // Release the file so the same image can be picked again after a
          // Discard.
          event.target.value = '';
        }}
      />

      <UserAvatar size="lg" src={src} name={name} />

      <Button
        type="button"
        variant="secondary"
        className="min-h-11 w-full"
        disabled={disabled}
        onClick={() => fileRef.current?.click()}
      >
        Trocar foto
      </Button>
    </>
  );
}

type AvatarFieldProps = Omit<AvatarPickerProps, 'onPick'> & {
  onSelect: (file: File) => void;
};

/** "Foto de perfil" card: the picked file feeds the form and the preview. */
export function AvatarField({
  src,
  name,
  disabled,
  onSelect,
}: AvatarFieldProps) {
  const { control } = useFormContext<profileFormData>();

  return (
    <Card className="order-first h-fit w-full shrink-0 gap-3 p-5 lg:order-none lg:w-64">
      <CardTitle className="text-base">Foto de perfil</CardTitle>

      <FormField
        control={control}
        name="avatar"
        render={({ field }) => (
          <FormItem className="items-center gap-3">
            <FormControl>
              <div className="flex w-full flex-col items-center gap-3">
                <AvatarPicker
                  src={src}
                  name={name}
                  disabled={disabled}
                  onPick={file => {
                    field.onChange(file);
                    onSelect(file);
                  }}
                />
              </div>
            </FormControl>
            <FormMessage className="text-center" />
          </FormItem>
        )}
      />
    </Card>
  );
}
