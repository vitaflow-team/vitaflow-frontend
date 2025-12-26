import { actionGetProductsPlans } from '@/_actions/products/getProdductsPlans';
import DefaultLayout from '@/_components/layout/defaultLayout';
import { CardUpgrade } from '@/_components/ui/cardUpgrade';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/_components/ui/tabs';
import { Title } from '@/_components/ui/title';
import { apiClient } from '@/_lib/apiClient';
import { profileFormData } from '@/_schema/profile';
import { auth } from '@/auth';
import FormSettings from './form';

export default async function Settings() {
  const session = await auth();
  if (!session) return null;

  let profile;
  try {
    profile = await apiClient<
      Omit<profileFormData, 'avatar'> & { avatar?: string | null }
    >('/profile', {
      method: 'GET',
    });
  } catch (error) {
    console.error('Falha ao carregar perfil:', error);
    return <div>Erro ao carregar perfil. Tente novamente mais tarde.</div>;
  }

  const [productsPlans, err] = await actionGetProductsPlans();
  const plans = productsPlans || [];

  return (
    <DefaultLayout>
      <Title label="Meu perfil" className="border-b border-primary text-left" />
      <div className="flex flex-col-reverse lg:flex-row gap-4 lg:gap-8 w-full justify-center px-2 mt-2">
        <FormSettings profile={profile} />
      </div>
      <Title label="Meu plano" className="border-b border-primary text-left" />
      {plans.length > 0 ? (
        <Tabs
          defaultValue={session.user.productGroupId || plans[0]?.id}
          className="w-full bg-secondary/30 rounded-md mt-2"
        >
          <TabsList className="w-full bg-secondary">
            {plans.map(plan => (
              <TabsTrigger key={plan.id} value={plan.id}>
                {plan.name}
              </TabsTrigger>
            ))}
          </TabsList>
          {plans.map(plan => (
            <TabsContent
              key={plan.id}
              value={plan.id}
              className="flex flex-col lg:flex-row p-4 gap-4 justify-center"
            >
              {plan.products
                .sort((a, b) => a.price - b.price)
                .map(product => (
                  <CardUpgrade
                    key={product.id}
                    title={product.name}
                    value={product.price}
                    information={false}
                    productId={product.id}
                    active={
                      session.user.productId === product.id ||
                      (session.user.productId === null &&
                        plans[0]?.products?.[0]?.id === product.id)
                    }
                    itens={product.productInfos.map(info => info.description)}
                  />
                ))}
            </TabsContent>
          ))}
        </Tabs>
      ) : (
        <div className="mt-4 p-4 text-center text-muted-foreground bg-secondary/30 rounded-md">
          Nenhum plano disponível no momento.
        </div>
      )}
    </DefaultLayout>
  );
}
