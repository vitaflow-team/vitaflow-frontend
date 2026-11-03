'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/_components/ui/dialog';
import { Button } from '@/_components/ui/button';
import type { BillingAccount } from '@/_types/billing';
import { useState } from 'react';
import { ConnectAccountForm } from './connectAccountForm';
import { DisconnectAccountDialog } from './disconnectAccountDialog';

interface BillingAccountCardProps {
  account: BillingAccount;
}

interface ReplaceKeyDialogProps {
  needsReconnect: boolean;
}

function ReplaceKeyDialog({ needsReconnect }: ReplaceKeyDialogProps) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          {needsReconnect ? 'Reconectar' : 'Trocar chave'}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {needsReconnect
              ? 'Reconectar sua conta Asaas'
              : 'Trocar a chave da conta Asaas'}
          </DialogTitle>
        </DialogHeader>
        {!needsReconnect && (
          <p className="text-muted-foreground text-sm">
            Isso substitui a conexão atual. As cobranças já criadas continuam
            vinculadas à conta anterior.
          </p>
        )}
        <ConnectAccountForm
          submitLabel={needsReconnect ? 'Reconectar' : 'Trocar chave'}
          onConnected={() => setOpen(false)}
        />
      </DialogContent>
    </Dialog>
  );
}

/** Connected or reconnect-needed: the key is never shown again, only the account's name. */
export function BillingAccountCard({ account }: BillingAccountCardProps) {
  const needsReconnect = account.status === 'RECONNECT_NEEDED';

  return (
    <div className="flex flex-col gap-3 rounded-lg border px-4 py-4">
      <div>
        <p className="font-medium">
          {needsReconnect
            ? 'A chave da sua conta Asaas foi recusada.'
            : `Conectado: ${account.accountName}`}
        </p>
        <p className="text-muted-foreground text-sm">
          Os pagamentos vão direto para a sua conta Asaas — a Vita Flow nunca
          tem acesso ao dinheiro.
        </p>
      </div>
      <div className="flex flex-wrap gap-2">
        <ReplaceKeyDialog needsReconnect={needsReconnect} />
        {!needsReconnect && (
          <DisconnectAccountDialog
            openInvoiceCount={account.openInvoiceCount}
          />
        )}
      </div>
    </div>
  );
}
