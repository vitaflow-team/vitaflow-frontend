import { Check } from 'lucide-react';
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
}: UpgradeCardProps) {
  const currencyFormatter = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });

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
      return <ChangePlanButton productId={productId} planName={title} />;
    }

    return <UpgradeCheckout productId={productId} />;
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
      <CardContent className="flex flex-col gap-2 p-0 flex-1">
        {itens?.map((item, index) => (
          <UpgradeCardItem key={index} label={item} />
        ))}
      </CardContent>
      {!information && renderAction()}
    </Card>
  );
}
