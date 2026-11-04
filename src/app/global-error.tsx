'use client';

import * as Sentry from '@sentry/nextjs';
import { useEffect } from 'react';
import './globals.css';

interface GlobalErrorProps {
  error: Error & { digest?: string };
}

/**
 * Net-new root error boundary (no `error.tsx`/`global-error.tsx` existed
 * before this feature): catches a render error no other boundary caught and
 * reports it to Sentry. Replaces the root layout entirely while active, so
 * it ships its own `<html>`/`<body>` and re-imports the global stylesheet.
 */
export default function GlobalError({ error }: GlobalErrorProps) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <html lang="pt-BR">
      <body>
        <div className="flex min-h-dvh flex-col items-center justify-center gap-4 p-8 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">
            Algo deu errado.
          </h1>
          <p className="text-muted-foreground text-sm">
            Nossa equipe já foi notificada. Tente novamente em alguns instantes.
          </p>
        </div>
      </body>
    </html>
  );
}
