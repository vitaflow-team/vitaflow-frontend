'use client';
import DefaultLayout from '@/_components/layout/defaultLayout';
import { NutritionistPlan } from '@/_components/layout/plans/nutritionist';
import { PersonalPlan } from '@/_components/layout/plans/personal';
import { UserPlan } from '@/_components/layout/plans/users';
import { UserAvatar } from '@/_components/layout/userAvatar';
import { Button } from '@/_components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from '@/_components/ui/form';
import { Input } from '@/_components/ui/input';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/_components/ui/tabs';
import { Title } from '@/_components/ui/title';
import { profileFormData, profileSchema } from '@/_schema/profile';
import { zodResolver } from '@hookform/resolvers/zod';
import { Mail } from 'lucide-react';
import { useTransition } from 'react';
import { useForm } from 'react-hook-form';

export default function Settings() {
  const methods = useForm<profileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      address: {
        city: '',
        state: '',
        streetName: '',
        streetNumber: '',
        zip: '',
      },
    },
  });
  const [isPending, startTransaction] = useTransition();

  function submitSingUp({ name, email, phone }: profileFormData) {
    startTransaction(async () => {});
  }

  return (
    <DefaultLayout>
      <Title label="Meu perfil" className="border-b border-primary text-left" />
      <div className="flex flex-col-reverse lg:flex-row gap-4 lg:gap-8 w-full justify-center px-2 mt-2">
        <Form {...methods}>
          <form
            onSubmit={methods.handleSubmit(submitSingUp)}
            className="flex flex-col w-full"
          >
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

            <div className="grid grid-rows-2 grid-cols-1 xl:grid-rows-1 xl:grid-cols-3 gap-0 xl:gap-4 w-full">
              <div className="flex gap-4 w-full col-span-2">
                <FormField
                  control={methods.control}
                  name="address.zip"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>CEP</FormLabel>
                      <FormControl>
                        <Input id="zip" {...field} disabled={isPending} />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={methods.control}
                  name="address.state"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>Estado</FormLabel>
                      <FormControl>
                        <Input id="state" {...field} disabled={isPending} />
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
        <div className="flex justify-center w-full lg:w-44 mx-1">
          <UserAvatar size="lg" />
        </div>
      </div>
      <Title label="Meu plano" className="border-b border-primary text-left" />
      <Tabs
        defaultValue="user"
        className="w-full bg-secondary/30 rounded-md mt-2"
      >
        <TabsList className="w-full bg-secondary">
          <TabsTrigger value="user">Usuário</TabsTrigger>
          <TabsTrigger value="personal">Educadores físicos</TabsTrigger>
          <TabsTrigger value="nutritionists">Nutricionistas</TabsTrigger>
        </TabsList>
        <TabsContent
          value="user"
          className="flex flex-col lg:flex-row p-4 gap-4 justify-center"
        >
          <UserPlan />
        </TabsContent>
        <TabsContent
          value="personal"
          className="flex flex-col lg:flex-row p-4 gap-4 justify-center"
        >
          <PersonalPlan />
        </TabsContent>
        <TabsContent
          value="nutritionists"
          className="flex flex-col lg:flex-row p-4 gap-4 justify-center"
        >
          <NutritionistPlan />
        </TabsContent>
      </Tabs>
    </DefaultLayout>
  );
}
