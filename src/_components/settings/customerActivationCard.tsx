import { Card, CardTitle } from '@/_components/ui/card';
import { CustomerActivationForm } from './customerActivationForm';

interface CustomerActivationCardProps {
  /** The account's current plan; the card exists only while there is none. */
  productId: string | null | undefined;
}

/**
 * An account created by a staff invitation has no plan. This is its way to
 * start using Vita Flow as a customer on the same account (US-011) — shown
 * whether or not the account still holds staff access (US-011.EC-5), and
 * never to an account that already has a plan (US-011.EC-4).
 */
export function CustomerActivationCard({
  productId,
}: CustomerActivationCardProps) {
  if (productId) return null;

  return (
    <Card className="h-fit gap-3 p-5">
      <CardTitle className="text-base">
        Começar a usar o Vita Flow como cliente
      </CardTitle>
      <p className="text-sm text-muted-foreground">
        Sua conta ainda não tem um plano. Ao aceitar os termos abaixo, ela entra
        no plano Gratuito e você pode registrar medidas, treinos e alimentação —
        na mesma conta, sem outro e-mail.
      </p>
      <CustomerActivationForm />
    </Card>
  );
}
