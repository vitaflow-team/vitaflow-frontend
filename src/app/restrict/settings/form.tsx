'use client';
import { Button } from '@/_components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from '@/_components/ui/form';
import { Input } from '@/_components/ui/input';
import { formatDate } from '@/_lib/stringUtils';
import { profileFormData, profileSchema } from '@/_schema/profile';
import { zodResolver } from '@hookform/resolvers/zod';
import { Mail } from 'lucide-react';
import { useTransition } from 'react';
import { useForm } from 'react-hook-form';

interface FormSettingsProps {
  profile: profileFormData;
}

export default function FormSettings({ profile }: FormSettingsProps) {
  const methods = useForm<profileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: profile.name,
      phone: profile.phone,
      birthDate: formatDate(profile.birthDate, 'en-CA'),
      avatar: profile.avatar,
      email: profile.email,
      address: {
        addressLine1: profile.address.addressLine1,
        addressLine2: profile.address.addressLine2,
        district: profile.address.district,
        city: profile.address.city,
        region: profile.address.region,
        postalCode: profile.address.postalCode,
      },
    },
  });
  const [isPending, startTransaction] = useTransition();

  function submitSingUp({
    name,
    email,
    birthDate,
    avatar,
    phone,
    address,
  }: profileFormData) {
    startTransaction(async () => {});
  }

  return (
    <Form {...methods}>
      <form
        onSubmit={methods.handleSubmit(submitSingUp)}
        className="flex flex-col w-full"
      >
        <div className="grid grid-rows-2 xl:grid-rows-1 xl:grid-cols-3 gap-0 xl:gap-4 w-full">
          <FormField
            control={methods.control}
            name="name"
            render={({ field }) => (
              <FormItem className="xl:col-span-2">
                <FormLabel>Nome</FormLabel>
                <FormControl>
                  <Input id="name" {...field} disabled={isPending} />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={methods.control}
            name="birthDate"
            render={({ field }) => (
              <FormItem className="xl:col-span-1">
                <FormLabel>Data de nascimento</FormLabel>
                <FormControl>
                  <Input
                    id="birthDate"
                    {...field}
                    disabled={isPending}
                    type="date"
                    max={formatDate(new Date().toString(), 'en-CA')}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-rows-2 xl:grid-rows-1 xl:grid-cols-3 gap-0 xl:gap-4 w-full">
          <FormField
            control={methods.control}
            name="email"
            render={({ field }) => (
              <FormItem className="xl:col-span-2">
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

          <FormField
            control={methods.control}
            name="phone"
            render={({ field }) => (
              <FormItem className="xl:col-span-1">
                <FormLabel>Telefone</FormLabel>
                <FormControl>
                  <Input id="phone" {...field} disabled={isPending} />
                </FormControl>
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={methods.control}
          name="address.addressLine1"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>Endereço</FormLabel>
              <FormControl>
                <Input id="addressLine1" {...field} disabled={isPending} />
              </FormControl>
            </FormItem>
          )}
        />

        <div className="grid grid-rows-2 grid-cols-1 xl:grid-rows-1 xl:grid-cols-3 gap-0 xl:gap-4 w-full">
          <FormField
            control={methods.control}
            name="address.addressLine2"
            render={({ field }) => (
              <FormItem className="xl:col-span-2">
                <FormLabel>Complemento</FormLabel>
                <FormControl>
                  <Input id="addressLine2" {...field} disabled={isPending} />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={methods.control}
            name="address.district"
            render={({ field }) => (
              <FormItem className="xl:col-span-1">
                <FormLabel>Bairro</FormLabel>
                <FormControl>
                  <Input id="district" {...field} disabled={isPending} />
                </FormControl>
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-rows-2 grid-cols-1 xl:grid-rows-1 xl:grid-cols-3 gap-0 xl:gap-4 w-full">
          <div className="flex gap-4 w-full col-span-2">
            <FormField
              control={methods.control}
              name="address.postalCode"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>CEP</FormLabel>
                  <FormControl>
                    <Input id="postalCode" {...field} disabled={isPending} />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={methods.control}
              name="address.region"
              render={({ field }) => (
                <FormItem className="w-full">
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
        </div>

        <div className="flex w-full justify-between mt-4">
          <Button type="submit" className="w-40" disabled={isPending}>
            Salvar
          </Button>
          <Button type="submit" variant="link" disabled={isPending}>
            Excluir meu perfil
          </Button>
        </div>
      </form>
    </Form>
  );
}
