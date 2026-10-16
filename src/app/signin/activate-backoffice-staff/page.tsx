import { RemoveParams } from '@/_components/layout/removeParams';
import {
  ActivationFailure,
  ActivationFrame,
} from '../activate/activationViews';
import { ActivateBackofficeStaffAccount } from './activateBackofficeStaffAccount';

interface ActivateBackofficeStaffPageProps {
  searchParams: Promise<{
    token?: string | string[];
  }>;
}

export default async function ActivateBackofficeStaffPage({
  searchParams,
}: ActivateBackofficeStaffPageProps) {
  const { token } = await searchParams;

  return (
    <RemoveParams>
      <ActivationFrame>
        {typeof token === 'string' && token ? (
          <ActivateBackofficeStaffAccount token={token} />
        ) : (
          <ActivationFailure />
        )}
      </ActivationFrame>
    </RemoveParams>
  );
}
