import { ButtonLink } from '@/_components/ui/buttonLink';
import { Title } from '@/_components/ui/title';
import { backofficeTierLabel } from '@/_lib/backofficeTier';
import type { BackofficeTier } from '@/_types/backofficeStaff';
import Link from 'next/link';

interface AcceptInvitationIntroProps {
  tier: BackofficeTier;
  googleLinked: boolean;
}

/** Names what is being offered before the person proves their password. */
export function AcceptInvitationIntro({
  tier,
  googleLinked,
}: AcceptInvitationIntroProps) {
  return (
    <>
      <Title
        label="Convite para a equipe Vita Flow"
        size="h1"
        className="mb-4 text-2xl"
        titlePosition="center"
      />
      <p className="text-lg w-full text-center">
        Você foi convidado para o nível de acesso{' '}
        <strong>{backofficeTierLabel(tier)}</strong>. Para aceitar, confirme com
        a senha da sua conta. Sua senha, seu plano e seus dados não mudam.
      </p>
      {googleLinked && (
        <p className="text-sm w-full text-center text-muted-foreground">
          Sua conta já entra com o Google: depois de aceitar, o login com Google
          também dará acesso à área da equipe.
        </p>
      )}
    </>
  );
}

/** For an account created with Google, which has no password of its own yet. */
export function PasswordRecoveryHint() {
  return (
    <p className="text-sm w-full text-center text-muted-foreground">
      Não lembra a senha ou criou a conta com o Google?{' '}
      <Link href="/signin" className="underline text-primary">
        Vá para o login
      </Link>{' '}
      e use &quot;Esqueci minha senha&quot; para definir uma. Depois, abra este
      convite de novo.
    </p>
  );
}

export function AcceptInvitationInvalid() {
  return (
    <>
      <Title
        label="Convite indisponível"
        size="h1"
        className="mb-4 text-2xl text-red-500"
        titlePosition="center"
      />
      <p className="text-lg w-full text-center">
        Este link de convite é inválido, já foi usado ou expirou.
      </p>
      <p className="text-lg w-full text-center">
        Peça um novo convite a um administrador da equipe Vita Flow.
      </p>
    </>
  );
}

export function AcceptInvitationSuccess() {
  return (
    <>
      <Title
        label="Tudo pronto!"
        size="h1"
        className="mb-4 text-2xl"
        titlePosition="center"
      />
      <p className="text-lg w-full text-center">
        Sua conta agora tem acesso à área da equipe Vita Flow. Entre de novo
        para que o acesso apareça.
      </p>
      <ButtonLink
        label="Ir para o login"
        url="/signin"
        variant="default"
        className="w-full py-6 text-lg"
      />
    </>
  );
}
