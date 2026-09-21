import { summarizePlanChange } from '@/_lib/planChangeSummary';
import type { PlanType } from '@/_lib/planSelection';
import type { PlanExpiry } from '@/_lib/planExpiry';
import { Check, TriangleAlert } from 'lucide-react';
import { Card, CardContent, CardTitle } from '../ui/card';
import { CancelSubscriptionControl } from './cancelSubscriptionControl';
import { ChangePlanButton } from './changePlanButton';
import { UpgradeCheckout } from './upgradeCheckout';

interface UpgradeCardItemProps {
  label: string;
}

export function UpgradeCardItem({ label }: UpgradeCardItemProps) {
  return (
    <div className="flex flex-row gap-2 w-full text-sm">
      <Check className="text-chart-2 size-4 shrink-0 mt-0.5" />
      <span>{label}</span>
    </div>
  );
}

/**
 * O que o card sabe sobre a troca que ele oferece. É contexto de conteúdo, não
 * de decisão: nenhuma regra de assinatura depende dele — ele só alimenta o
 * resumo exibido dentro dos diálogos que já existem (ADR-003, ADR-010).
 */
export interface PlanChangeContext {
  /** Nome do plano vigente, para a linha "Plano atual" do resumo. */
  currentPlanName: string;
  /** Id do plano vigente; `null` quando não dá para dizer qual é. */
  currentPlanId: string | null;
  currentType: PlanType;
  /** Tipo do plano deste card. */
  targetType: PlanType;
  /** `null` quando o perfil não trouxe a contagem de alunos (ADR-005). */
  clientsCount: number | null;
}

interface UpgradeCardProps {
  title: string;
  value?: number;
  active?: boolean;
  featured?: boolean;
  information?: boolean;
  productId?: string;
  itens?: string[];
  hasActiveSubscription?: boolean;
  subscriptionCancelAt?: string | null;
  /**
   * Como a data do plano vigente é escrita, já decidida pelo backend e
   * formatada por `planExpiry` (ADR-004). É informação, não regra: nenhuma
   * decisão de assinatura depende dela.
   */
  planExpiry?: PlanExpiry | null;
  /** Linha "Para quem é" do catálogo (ADR-001); ausente nas páginas públicas. */
  audience?: string;
  /** Contexto do resumo de troca; ausente fora da aba Plano. */
  planChange?: PlanChangeContext;
}

export function UpgradeCard({
  title,
  value = 0,
  active = false,
  featured = false,
  information = false,
  itens,
  productId,
  hasActiveSubscription = false,
  subscriptionCancelAt = null,
  planExpiry = null,
  audience,
  planChange,
}: UpgradeCardProps) {
  const currencyFormatter = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });

  // `summarizePlanChange` devolve `null` quando o alvo já é o plano vigente,
  // e é o mesmo `null` que faz os diálogos não mostrarem resumo nenhum.
  const changeSummary =
    planChange && productId
      ? summarizePlanChange({
          current: {
            id: planChange.currentPlanId,
            type: planChange.currentType,
          },
          target: { id: productId, type: planChange.targetType },
          hasActiveSubscription,
          clientsCount: planChange.clientsCount,
        })
      : null;

  function renderAction() {
    if (value === 0) {
      return null;
    }

    if (active) {
      return (
        <CancelSubscriptionControl
          subscriptionCancelAt={subscriptionCancelAt}
        />
      );
    }

    if (!productId) {
      return null;
    }

    if (hasActiveSubscription) {
      return (
        <ChangePlanButton
          productId={productId}
          planName={title}
          summary={changeSummary}
          currentPlanName={planChange?.currentPlanName}
          currentType={planChange?.currentType}
          targetType={planChange?.targetType}
        />
      );
    }

    return (
      <UpgradeCheckout
        productId={productId}
        planName={title}
        summary={changeSummary}
        currentPlanName={planChange?.currentPlanName}
        currentType={planChange?.currentType}
        targetType={planChange?.targetType}
      />
    );
  }

  return (
    <Card
      className={`relative flex w-full md:w-80 gap-3 p-5 ${
        featured ? 'border-icon-accent shadow-md' : ''
      }`}
    >
      {featured && (
        <span className="absolute -top-2.5 right-5 rounded-full bg-primary px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-primary-foreground">
          Mais popular
        </span>
      )}
      <div className="flex items-center justify-between gap-2">
        <CardTitle className="text-sm">{title}</CardTitle>
        {active && !information && (
          <span className="inline-flex w-fit shrink-0 items-center gap-1 rounded-full bg-accent px-2.5 py-1 text-xs font-semibold text-accent-foreground">
            <Check className="size-3" />
            Seu plano atual
          </span>
        )}
      </div>
      <div className="flex items-baseline gap-1">
        <span className="font-display text-3xl font-semibold">
          {currencyFormatter.format(value)}
        </span>
        <span className="text-sm text-muted-foreground">/mês</span>
      </div>
      {audience && (
        <p className="text-xs text-muted-foreground">
          <span className="font-semibold text-foreground">Para quem é: </span>
          {audience}
        </p>
      )}
      <CardContent className="flex flex-col gap-2 p-0 flex-1">
        {itens?.map((item, index) => (
          <UpgradeCardItem key={index} label={item} />
        ))}
      </CardContent>
      {/* Uma linha só para a data do plano vigente: o controle de assinatura
          não escreve mais data nenhuma (ADR-004). O estado de alerta se
          distingue por ícone e texto, não apenas por cor (US-002.EC-4). */}
      {!information &&
        active &&
        value > 0 &&
        planExpiry &&
        (planExpiry.kind === 'expires' ? (
          <p
            role="status"
            className="flex items-center justify-center gap-1.5 rounded-md bg-warn-bg px-2 py-1.5 text-xs font-medium text-warn"
          >
            <TriangleAlert className="size-3.5 shrink-0" aria-hidden="true" />
            {planExpiry.label}
          </p>
        ) : (
          <p className="text-xs text-muted-foreground text-center">
            {planExpiry.label}
          </p>
        ))}
      {!information && renderAction()}
    </Card>
  );
}
