import type { ProductsPlan } from '@/_actions/products/getProdductsPlans';
import {
  UpgradeCard,
  type PlanChangeContext,
} from '@/_components/upgrade/upgradeCard';
import { planAudience, planTitle } from '@/_lib/planAudience';
import { groupPlans, type PlanSections } from '@/_lib/planSelection';

interface PlanPanelProps {
  plans: ProductsPlan[];
  productId?: string | null;
  hasActiveSubscription: boolean;
  subscriptionCancelAt: string | null;
  subscriptionCurrentPeriodEnd: string | null;
  /** `null` quando o perfil não trouxe a contagem de alunos (ADR-005). */
  clientsCount: number | null;
  /** A lista de planos não chegou; a tira de abas segue de pé (US-001.EC-1). */
  loadFailed?: boolean;
}

interface PlanCardsProps {
  products: ProductsPlan['products'];
  sections: PlanSections;
  hasActiveSubscription: boolean;
  subscriptionCancelAt: string | null;
  subscriptionCurrentPeriodEnd: string | null;
  currentPlanName: string;
  clientsCount: number | null;
}

/**
 * Uma coluna no celular, sem rolagem horizontal: os cards só entram em linha a
 * partir de `md`, onde a largura fixa deles cabe lado a lado (US-001.EC-4).
 */
function PlanCards({
  products,
  sections,
  hasActiveSubscription,
  subscriptionCancelAt,
  subscriptionCurrentPeriodEnd,
  currentPlanName,
  clientsCount,
}: PlanCardsProps) {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:flex-wrap md:justify-center">
      {products.map(product => {
        const isCurrent = product.id === sections.currentProductId;
        const planChange: PlanChangeContext = {
          currentPlanName,
          currentPlanId: sections.currentProductId,
          currentType: sections.currentType,
          targetType: product.type,
          clientsCount,
        };

        return (
          <UpgradeCard
            key={product.id}
            title={planTitle(product.name, product.type)}
            value={product.price}
            information={false}
            productId={product.id}
            active={isCurrent}
            audience={planAudience(product.type)}
            planChange={planChange}
            hasActiveSubscription={hasActiveSubscription}
            subscriptionCancelAt={subscriptionCancelAt}
            renewsAt={
              isCurrent && hasActiveSubscription
                ? subscriptionCurrentPeriodEnd
                : null
            }
            itens={product.productInfos.map(info => info.description)}
          />
        );
      })}
    </div>
  );
}

function PlanMessage({ children }: { children: string }) {
  return (
    <div className="mt-4 p-4 text-center text-muted-foreground bg-secondary/30 rounded-md">
      {children}
    </div>
  );
}

/**
 * O catálogo inteiro em duas seções de público, "Para você" e "Para
 * profissionais" (esta com subtítulo por profissão), em vez do filtro pelo tipo
 * do usuário (ADR-001, que substitui a ADR-004 de `settings-tabs-and-account`).
 *
 * Aqui se escolhe o que mostrar e qual contexto passar; o que cada botão faz
 * continua inteiro dentro do `UpgradeCard` e dos controles de assinatura.
 */
export function PlanPanel({
  plans,
  productId,
  hasActiveSubscription,
  subscriptionCancelAt,
  subscriptionCurrentPeriodEnd,
  clientsCount,
  loadFailed = false,
}: PlanPanelProps) {
  if (loadFailed) {
    return (
      <div
        role="alert"
        className="mt-4 p-4 text-center text-destructive bg-secondary/30 rounded-md"
      >
        Não foi possível carregar os planos. Tente novamente mais tarde.
      </div>
    );
  }

  const sections = groupPlans(plans, productId);

  if (!sections) {
    return <PlanMessage>Nenhum plano disponível no momento.</PlanMessage>;
  }

  const personalProducts = sections.personal.flatMap(group => group.products);
  const currentProduct = [
    ...personalProducts,
    ...sections.professional.flatMap(g => g.products),
  ].find(product => product.id === sections.currentProductId);
  // Com o tipo no nome, o diálogo não diz "de Premium para Premium".
  const currentPlanName = currentProduct
    ? planTitle(currentProduct.name, currentProduct.type)
    : 'Sem plano';

  const cardProps = {
    sections,
    hasActiveSubscription,
    subscriptionCancelAt,
    subscriptionCurrentPeriodEnd,
    currentPlanName,
    clientsCount,
  };

  if (personalProducts.length === 0 && sections.professional.length === 0) {
    return <PlanMessage>Nenhum plano disponível no momento.</PlanMessage>;
  }

  return (
    <div className="flex flex-col gap-8 pt-2">
      {/* Uma seção sem produto nenhum simplesmente não aparece (US-001.EC-2). */}
      {personalProducts.length > 0 && (
        <section
          aria-labelledby="plan-section-personal"
          className="flex flex-col gap-4"
        >
          <h3
            id="plan-section-personal"
            className="font-display text-lg font-semibold"
          >
            Para você
          </h3>
          <PlanCards products={personalProducts} {...cardProps} />
        </section>
      )}

      {sections.professional.length > 0 && (
        <section
          aria-labelledby="plan-section-professional"
          className="flex flex-col gap-4"
        >
          <h3
            id="plan-section-professional"
            className="font-display text-lg font-semibold"
          >
            Para profissionais
          </h3>
          {sections.professional.map(group => (
            <div key={group.id} className="flex flex-col gap-3">
              <h4 className="text-sm font-semibold text-muted-foreground">
                {group.name}
              </h4>
              <PlanCards products={group.products} {...cardProps} />
            </div>
          ))}
        </section>
      )}
    </div>
  );
}
