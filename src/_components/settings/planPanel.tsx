import type { Product } from '@/_actions/products/getPlans';
import { PlanCategoryTabs } from '@/_components/settings/planCategoryTabs';
import {
  UpgradeCard,
  type PlanChangeContext,
} from '@/_components/upgrade/upgradeCard';
import { planAudience, planTitle } from '@/_lib/planAudience';
import {
  PLAN_CATEGORY_KEYS,
  filterPlansByCategory,
  initialCategory,
  resolveCurrentPlan,
  type PlanCategoryKey,
} from '@/_lib/planCategories';
import { planExpiry } from '@/_lib/planExpiry';
import type { ReactNode } from 'react';

interface PlanPanelProps {
  /** Catálogo inteiro, já ordenado pelo backend; filtrado em memória (ADR-003). */
  plans: Product[];
  productId?: string | null;
  /** Tipo do perfil; define a sub-aba aberta ao entrar (US-006.AC-2). */
  profileType?: string | null;
  hasActiveSubscription: boolean;
  /** Cancelamento agendado, ainda a chave do controle de assinatura. */
  subscriptionCancelAt: string | null;
  /** Data e renovação já derivadas pelo backend; aqui só se escreve (ADR-004). */
  expiresAt: string | null;
  autoRenew: boolean;
  /** `null` quando o perfil não trouxe a contagem de alunos. */
  clientsCount: number | null;
  /** A lista de planos não chegou; a tira de abas da página segue de pé. */
  loadFailed?: boolean;
}

function PlanMessage({ children }: { children: string }) {
  return (
    <div
      role="status"
      className="mt-4 p-4 text-center text-muted-foreground bg-secondary/30 rounded-md"
    >
      {children}
    </div>
  );
}

/**
 * A aba Plano: um controle de categoria e, abaixo dele, os planos daquela
 * categoria. As duas seções de público ("Para você" / "Para profissionais")
 * saíram junto com `groupPlans` (ADR-001).
 *
 * Aqui se escolhe o que mostrar e qual contexto passar; o que cada botão faz
 * continua inteiro dentro do `UpgradeCard` e dos controles de assinatura.
 */
export function PlanPanel({
  plans,
  productId,
  profileType,
  hasActiveSubscription,
  subscriptionCancelAt,
  expiresAt,
  autoRenew,
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

  // O plano vigente sai da lista inteira, não da categoria visível: quem paga
  // um plano profissional continua vendo "Seu plano atual" ao abrir a aba dele,
  // e nenhum card é marcado nas outras (ADR-003, US-009.EC-1).
  const current = resolveCurrentPlan(plans, productId);
  const currentProduct = plans.find(plan => plan.id === current.id);
  // Com o tipo no nome, o diálogo não diz "de Premium para Premium".
  const currentPlanName = currentProduct
    ? planTitle(currentProduct.name, currentProduct.type)
    : 'Sem plano';
  const expiry = planExpiry({ expiresAt, autoRenew });

  function panelOf(key: PlanCategoryKey): ReactNode {
    const categoryPlans = filterPlansByCategory(plans, key);

    if (categoryPlans.length === 0) {
      return (
        <PlanMessage>Nenhum plano disponível para esta categoria</PlanMessage>
      );
    }

    return (
      // Uma coluna no celular, sem rolagem horizontal: os cards só entram em
      // linha a partir de `md`, onde a largura fixa deles cabe lado a lado.
      <div className="flex flex-col gap-4 md:flex-row md:flex-wrap md:justify-center">
        {categoryPlans.map(product => {
          const isCurrent = product.id === current.id;
          const planChange: PlanChangeContext = {
            currentPlanName,
            currentPlanId: current.id,
            currentType: current.type,
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
              planExpiry={isCurrent && hasActiveSubscription ? expiry : null}
              itens={product.productInfos.map(info => info.description)}
            />
          );
        })}
      </div>
    );
  }

  const panels = Object.fromEntries(
    PLAN_CATEGORY_KEYS.map(key => [key, panelOf(key)])
  ) as Record<PlanCategoryKey, ReactNode>;

  return (
    <PlanCategoryTabs initial={initialCategory(profileType)} panels={panels} />
  );
}
