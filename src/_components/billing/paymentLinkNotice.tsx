'use client';

import { Button } from '@/_components/ui/button';
import { useState } from 'react';

interface PaymentLinkNoticeProps {
  paymentUrl: string;
}

/** Shown when the invoice e-mail did not go out, so the link isn't lost (UT-125, US-004.EC-8). */
export function PaymentLinkNotice({ paymentUrl }: PaymentLinkNoticeProps) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    await navigator.clipboard.writeText(paymentUrl);
    setCopied(true);
  }

  return (
    <div className="flex flex-col gap-2 rounded-lg border border-amber-300 bg-amber-50 p-3 text-sm dark:border-amber-800 dark:bg-amber-950">
      <p>
        O e-mail de cobrança não pôde ser enviado. Copie o link e envie para o
        aluno por outro meio.
      </p>
      <div className="flex items-center gap-2">
        <input
          readOnly
          value={paymentUrl}
          className="min-w-0 flex-1 rounded border bg-background px-2 py-1 text-xs"
          onFocus={event => event.currentTarget.select()}
        />
        <Button type="button" variant="outline" onClick={handleCopy}>
          {copied ? 'Copiado!' : 'Copiar link'}
        </Button>
      </div>
    </div>
  );
}
