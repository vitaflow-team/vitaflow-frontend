import { RemoveParams } from '@/_components/layout/removeParams';
import {
  ActivationFrame,
  ActivationFailure,
} from '../activate/activationViews';
import { ActivateStaffAccount } from './activateStaffAccount';

interface ActivateStaffPageProps {
  searchParams: Promise<{
    token?: string | string[];
  }>;
}

export default async function ActivateStaffPage({
  searchParams,
}: ActivateStaffPageProps) {
  const { token } = await searchParams;

  return (
    <RemoveParams>
      <ActivationFrame>
        {typeof token === 'string' && token ? (
          <ActivateStaffAccount token={token} />
        ) : (
          <ActivationFailure />
        )}
      </ActivationFrame>
    </RemoveParams>
  );
}
