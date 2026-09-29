'use client';

import { actionActivateAccount } from '@/_actions/users/postActivateAccount';
import { useServerAction } from 'zsa-react';
import {
  ActivationConfirm,
  ActivationFailure,
  ActivationSuccess,
} from './activationViews';

interface ActivateAccountProps {
  token: string;
}

export function ActivateAccount({ token }: ActivateAccountProps) {
  const { execute, isPending, isSuccess, isError } = useServerAction(
    actionActivateAccount
  );

  if (isSuccess) return <ActivationSuccess />;
  if (isError) return <ActivationFailure />;

  return (
    <ActivationConfirm
      isPending={isPending}
      onConfirm={() => execute({ token })}
    />
  );
}
