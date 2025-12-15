'use client';

import { Suspense } from 'react';
import { NewPassword } from './newPassword';

export function NewPasswordWrapper() {
  return (
    <Suspense fallback={null}>
      <NewPassword />
    </Suspense>
  );
}
