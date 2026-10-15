import { Button } from '@/_components/ui/button';
import { FormError } from './formError';

interface AddStudentConfirmStepProps {
  email: string;
  accountName: string | null;
  isPending: boolean;
  error: string | null;
  onLink: () => void;
  onCancel: () => void;
  onRegisterWithout?: () => void;
}

/**
 * Step 2a: an account with this e-mail exists. Nothing is linked until the
 * educator confirms that this is their student.
 */
export function AddStudentConfirmStep({
  email,
  accountName,
  isPending,
  error,
  onLink,
  onCancel,
  onRegisterWithout,
}: AddStudentConfirmStepProps) {
  return (
    <div className="flex flex-col gap-3">
      <div className="rounded-md border border-line p-3">
        <p className="text-sm font-semibold">Já tem uma conta Vita Flow</p>
        {accountName && <p className="mt-1 font-medium">{accountName}</p>}
        <p className="text-sm text-muted-foreground">{email}</p>
        <p className="mt-2 text-sm text-muted-foreground">
          Confirme que é o seu aluno. Ao vincular, ele passa a ver as avaliações
          que você registrar.
        </p>
      </div>
      <FormError message={error} />
      <Button type="button" onClick={onLink} disabled={isPending}>
        {isPending ? 'Vinculando…' : 'Vincular aluno'}
      </Button>
      <Button
        type="button"
        variant="outline"
        onClick={onCancel}
        disabled={isPending}
      >
        Cancelar
      </Button>
      {onRegisterWithout && (
        <Button
          type="button"
          variant="link"
          onClick={onRegisterWithout}
          disabled={isPending}
        >
          Cadastrar sem conta de usuário
        </Button>
      )}
    </div>
  );
}
