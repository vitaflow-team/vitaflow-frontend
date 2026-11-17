import { Card, CardTitle } from '@/_components/ui/card';
import { isGoogleSignInEnabled } from '@/_lib/googleSignIn';
import { ConnectGoogleButton } from './connectGoogleButton';
import { ConnectGoogleDialog } from './connectGoogleDialog';

interface GoogleConnectionCardProps {
  /** Whether the account already signs in with Google. */
  googleLinked: boolean;
  /** Staff access: connecting then asks for the current password. */
  isBackoffice: boolean;
}

/**
 * Whether Google is connected, and the way to connect it (US-005). Absent
 * where Google sign-in is not configured. There is no way to disconnect
 * from here — that is outside this feature.
 */
export function GoogleConnectionCard({
  googleLinked,
  isBackoffice,
}: GoogleConnectionCardProps) {
  if (!isGoogleSignInEnabled()) return null;

  return (
    <Card className="h-fit gap-3 p-5">
      <CardTitle className="text-base">Login com Google</CardTitle>
      {googleLinked ? (
        <p className="text-sm text-muted-foreground">
          <strong className="text-foreground">Google conectado.</strong> Você
          pode entrar com o Google ou com e-mail e senha, sempre na mesma conta.
        </p>
      ) : (
        <>
          <p className="text-sm text-muted-foreground">
            Conecte a conta Google que usa o mesmo e-mail desta conta para
            também entrar com o Google.
          </p>
          {isBackoffice ? <ConnectGoogleDialog /> : <ConnectGoogleButton />}
        </>
      )}
    </Card>
  );
}
