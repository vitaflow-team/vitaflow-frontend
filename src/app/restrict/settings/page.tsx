import DefaultLayout from '@/_components/layout/defaultLayout';
import { NutritionistPlan } from '@/_components/layout/plans/nutritionist';
import { PersonalPlan } from '@/_components/layout/plans/personal';
import { UserPlan } from '@/_components/layout/plans/users';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/_components/ui/tabs';
import { Title } from '@/_components/ui/title';
import { apiClient } from '@/_lib/apiClient';
import { auth } from '@/auth';
import FormSettings from './form';

import { profileFormData } from '@/_schema/profile';

// ... imports

export default async function Settings() {
  const session = await auth();
  if (!session) return null;

  const profile = await apiClient<
    Omit<profileFormData, 'avatar'> & { avatar?: string | null }
  >('/profile/profile', {
    method: 'GET',
  });

  return (
    <DefaultLayout>
      <Title label="Meu perfil" className="border-b border-primary text-left" />
      <div className="flex flex-col-reverse lg:flex-row gap-4 lg:gap-8 w-full justify-center px-2 mt-2">
        <FormSettings profile={profile} />
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
