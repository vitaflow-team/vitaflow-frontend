'use client';

import { actionChangeProfile } from '@/_actions/users/postChangeProfile';
import { UserAvatar } from '@/_components/layout/userAvatar';
import { SaveBar } from '@/_components/settings/saveBar';
import { useUnsavedChanges } from '@/_components/settings/unsavedChangesProvider';
import { Button } from '@/_components/ui/button';
import { Card, CardTitle } from '@/_components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/_components/ui/form';
import { Input } from '@/_components/ui/input';
import { useAlertHook } from '@/_hooks/alertHook';
import { formatCep, formatDate, formatPhone } from '@/_lib/stringUtils';
import { profileFormData, profileSchema } from '@/_schema/profile';
import { zodResolver } from '@hookform/resolvers/zod';
import { Mail } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useServerAction } from 'zsa-react';

interface FormSettingsProps {
  profile: Omit<profileFormData, 'avatar'> & { avatar?: string | null };
}

function toFormValues(profile: FormSettingsProps['profile']): profileFormData {
  return {
    name: profile.name ?? '',
    phone: profile.phone ?? '',
    birthDate: profile.birthDate ? formatDate(profile.birthDate, 'en-CA') : '',
    avatar: undefined,
    email: profile.email ?? '',
    address: {
      addressLine1: profile.address?.addressLine1 ?? '',
      addressLine2: profile.address?.addressLine2 ?? '',
      district: profile.address?.district ?? '',
      city: profile.address?.city ?? '',
      region: profile.address?.region ?? '',
      postalCode: profile.address?.postalCode ?? '',
    },
  };
}

export default function FormSettings({ profile }: FormSettingsProps) {
  const { isPending, execute } = useServerAction(actionChangeProfile);
  const { setDirty } = useUnsavedChanges();
  const { openError } = useAlertHook();
  const router = useRouter();

  const [savedValues, setSavedValues] = useState<profileFormData>(() =>
    toFormValues(profile)
  );
  const [savedAvatar, setSavedAvatar] = useState<string | null>(
    profile.avatar ?? null
  );
  const [preview, setPreview] = useState<string | null>(null);

  const methods = useForm<profileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: savedValues,
  });

  const fileRef = useRef<HTMLInputElement>(null);
  const objectUrls = useRef<string[]>([]);

  const isDirty = methods.formState.isDirty;

  // O formulário de Perfil é o único a declarar alterações pendentes; ao sair
  // da aba a proteção precisa cair junto com ele (ADR-009).
  useEffect(() => {
    setDirty(isDirty);
    return () => setDirty(false);
  }, [isDirty, setDirty]);

  useEffect(() => {
    const urls = objectUrls.current;
    return () => {
      urls.forEach(url => URL.revokeObjectURL(url));
    };
  }, []);

  function createPreview(file: File) {
    const url = URL.createObjectURL(file);
    objectUrls.current.push(url);
    return url;
  }

  function handleDiscard() {
    methods.reset(savedValues);
    setPreview(null);
  }

  async function submitProfile(data: profileFormData) {
    // Segunda tranca contra o clique duplo: o botão já fica desabilitado, mas
    // um envio por teclado durante a requisição ainda chegaria aqui.
    if (isPending) return;

    const [, error] = await execute(data);

    if (error) {
      // Falha mantém a barra e as edições: o usuário decide se tenta de novo.
      openError(
        error.message || 'Erro ao atualizar perfil.',
        'Atenção!',
        'error'
      );
      return;
    }

    const saved = { ...data, avatar: undefined };
    setSavedValues(saved);
    if (preview) setSavedAvatar(preview);
    setPreview(null);
    methods.reset(saved);

    // O topo e o menu leram o perfil antes deste salvamento.
    router.refresh();
  }

  const avatarSrc = preview ?? savedAvatar ?? undefined;

  return (
    <Form {...methods}>
      <form
        onSubmit={methods.handleSubmit(submitProfile)}
        className="flex w-full flex-col gap-4 lg:flex-row"
      >
        <div className="grid w-full gap-4 lg:grid-cols-2">
          <Card className="h-fit gap-3 p-5">
            <CardTitle className="text-base">Dados pessoais</CardTitle>

            <FormField
              control={methods.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome</FormLabel>
                  <FormControl>
                    <Input id="name" {...field} disabled={isPending} />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={methods.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>E-Mail</FormLabel>
                  <FormControl>
                    <Input
                      id="email"
                      {...field}
                      icon={Mail}
                      disabled={isPending}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <div className="grid gap-x-4 sm:grid-cols-2">
              <FormField
                control={methods.control}
                name="birthDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Data de nascimento</FormLabel>
                    <FormControl>
                      <Input
                        id="birthDate"
                        {...field}
                        disabled={isPending}
                        type="date"
                        max={new Date().toISOString().split('T')[0]}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={methods.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Telefone</FormLabel>
                    <FormControl>
                      <Input
                        id="phone"
                        {...field}
                        disabled={isPending}
                        onBlur={e => {
                          const formatted = formatPhone(e.target.value);
                          field.onChange(formatted);
                        }}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
          </Card>

          <Card className="h-fit gap-3 p-5">
            <CardTitle className="text-base">Endereço</CardTitle>

            <FormField
              control={methods.control}
              name="address.addressLine1"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Endereço</FormLabel>
                  <FormControl>
                    <Input id="addressLine1" {...field} disabled={isPending} />
                  </FormControl>
                </FormItem>
              )}
            />

            <div className="grid gap-x-4 sm:grid-cols-2">
              <FormField
                control={methods.control}
                name="address.addressLine2"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Complemento</FormLabel>
                    <FormControl>
                      <Input
                        id="addressLine2"
                        {...field}
                        disabled={isPending}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={methods.control}
                name="address.district"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bairro</FormLabel>
                    <FormControl>
                      <Input id="district" {...field} disabled={isPending} />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            <div className="grid gap-x-4 sm:grid-cols-2">
              <FormField
                control={methods.control}
                name="address.postalCode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>CEP</FormLabel>
                    <FormControl>
                      <Input
                        id="postalCode"
                        {...field}
                        disabled={isPending}
                        onBlur={e => {
                          const formatted = formatCep(e.target.value);
                          field.onChange(formatted);
                        }}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={methods.control}
                name="address.region"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Estado</FormLabel>
                    <FormControl>
                      <Input id="region" {...field} disabled={isPending} />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={methods.control}
              name="address.city"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cidade</FormLabel>
                  <FormControl>
                    <Input id="city" {...field} disabled={isPending} />
                  </FormControl>
                </FormItem>
              )}
            />
          </Card>
        </div>

        <Card className="order-first h-fit w-full shrink-0 gap-3 p-5 lg:order-none lg:w-64">
          <CardTitle className="text-base">Foto de perfil</CardTitle>

          <FormField
            control={methods.control}
            name="avatar"
            render={({ field }) => (
              <FormItem className="items-center gap-3">
                <FormControl>
                  <div className="flex w-full flex-col items-center gap-3">
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      ref={fileRef}
                      disabled={isPending}
                      onChange={e => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        field.onChange(file);
                        setPreview(createPreview(file));
                        // Solta o arquivo para que a mesma imagem possa ser
                        // escolhida de novo depois de um Descartar.
                        e.target.value = '';
                      }}
                    />

                    <UserAvatar size="lg" src={avatarSrc} name={profile.name} />

                    <Button
                      type="button"
                      variant="secondary"
                      className="min-h-11 w-full"
                      disabled={isPending}
                      onClick={() => fileRef.current?.click()}
                    >
                      Trocar foto
                    </Button>
                  </div>
                </FormControl>
                <FormMessage className="text-center" />
              </FormItem>
            )}
          />
        </Card>

        {/* A barra flutua sobre o conteúdo; este espaço evita que ela cubra os
            últimos campos do formulário (US-004.EC-5). */}
        {isDirty && <div aria-hidden className="h-28 md:h-20" />}

        <SaveBar
          visible={isDirty}
          isSaving={isPending}
          onDiscard={handleDiscard}
        />
      </form>
    </Form>
  );
}
