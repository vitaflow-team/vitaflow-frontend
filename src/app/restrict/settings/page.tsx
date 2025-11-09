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
  FormMessage,
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
      <div className="flex flex-col-reverse lg:flex-row gap-4 lg:gap-8 w-full justify-center mt-2">
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
                  <FormControl>
                    <Input
                      id="name"
                      placeholder="Informe seu nome"
                      {...field}
                      disabled={isPending}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-rows-2 xl:grid-rows-1 xl:grid-cols-3 gap-0 xl:gap-4 w-full">
              <FormField
                control={methods.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="xl:col-span-2">
                    <FormControl>
                      <Input
                        id="email"
                        placeholder="Informe seu e-mail"
                        {...field}
                        icon={Mail}
                        disabled={isPending}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={methods.control}
                name="phone"
                render={({ field }) => (
                  <FormItem className="xl:col-span-1">
                    <FormControl>
                      <Input
                        id="phone"
                        placeholder="Informe o telefone"
                        {...field}
                        disabled={isPending}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-rows-3 xl:grid-rows-1 xl:grid-cols-3 gap-0 xl:gap-4 w-full">
              <FormField
                control={methods.control}
                name="address.zip"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        id="zip"
                        placeholder="Informe o CEP"
                        {...field}
                        disabled={isPending}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={methods.control}
                name="address.state"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        id="state"
                        placeholder="Informe o estado"
                        {...field}
                        disabled={isPending}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={methods.control}
                name="address.city"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        id="city"
                        placeholder="Informe a cidade"
                        {...field}
                        disabled={isPending}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex w-full justify-between">
              <Button type="submit" className="w-40" disabled={isPending}>
                Salvar
              </Button>
              <Button type="submit" variant="link" disabled={isPending}>
                Excluir meu perfil
              </Button>
            </div>
          </form>
        </Form>
        <div className="flex justify-center w-full lg:w-44">
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
