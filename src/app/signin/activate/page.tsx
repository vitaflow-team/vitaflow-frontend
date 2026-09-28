import { RemoveParams } from '@/_components/layout/removeParams';
import { ActivateAccount } from './activateAccount';
import { ActivationFailure, ActivationFrame } from './activationViews';

interface ActivatePageProps {
  searchParams: Promise<{
    token?: string | string[];
  }>;
}

// Rendering never calls the backend: e-mail clients and link scanners open
// this URL on their own, so activation waits for the user's confirmation,
// which posts through `actionActivateAccount` (US-008).
export default async function ActivatePage({
  searchParams,
}: ActivatePageProps) {
  const { token } = await searchParams;

  return (
    <RemoveParams>
      <ActivationFrame>
        {typeof token === 'string' && token ? (
          <ActivateAccount token={token} />
        ) : (
          <ActivationFailure />
        )}
      </ActivationFrame>
    </RemoveParams>
  );
}
