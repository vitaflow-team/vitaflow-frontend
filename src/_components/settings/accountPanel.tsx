import { Card, CardTitle } from '@/_components/ui/card';
import { DeleteAccountDialog } from './deleteAccountDialog';
import { SignOutButton } from './signOutButton';

interface AccountPanelProps {
  email: string;
  /** `null` quando o perfil não trouxe a contagem; `0` para quem não é profissional. */
  clientsCount: number | null;
  isProfessional: boolean;
  hasPaidSubscription: boolean;
}

/**
 * A aba Conta é o que o celular tem no lugar da barra lateral: e-mail, saída
 * da sessão e a exclusão definitiva (ADR-001). Nada daqui é editável — o
 * e-mail é texto, não campo, para não sugerir uma troca que a tela não faz
 * (US-008.EC-1).
 *
 * Nenhum identificador do Stripe chega até aqui: a ação de exclusão lê os ids
 * do backend no servidor, e o cliente só sabe se existe um plano pago ativo.
 */
export function AccountPanel({
  email,
  clientsCount,
  isProfessional,
  hasPaidSubscription,
}: AccountPanelProps) {
  return (
    <div className="flex flex-col gap-4">
      <Card className="h-fit gap-3 p-5">
        <CardTitle className="text-base">Dados de acesso</CardTitle>
        <div className="flex flex-col gap-1">
          <span className="text-sm text-muted-foreground">E-mail</span>
          <p className="text-base break-all">{email}</p>
        </div>
        <SignOutButton />
      </Card>

      <Card className="h-fit gap-3 border-destructive/50 p-5">
        <CardTitle className="text-base text-destructive">
          Zona de risco
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Excluir a conta apaga seus dados para sempre. Não há como recuperar
          depois.
        </p>
        <DeleteAccountDialog
          email={email}
          clientsCount={clientsCount}
          isProfessional={isProfessional}
          hasPaidSubscription={hasPaidSubscription}
        />
      </Card>
    </div>
  );
}
