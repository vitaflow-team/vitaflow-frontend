'use client';

import {
  actionDeleteClientsByUser,
  type DeleteClientResult,
} from '@/_actions/clients/deleteClientsByUser';
import DefaultLayout from '@/_components/layout/defaultLayout';
import { ButtonLink } from '@/_components/ui/buttonLink';
import { DataTable } from '@/_components/ui/dataTable';
import { Title } from '@/_components/ui/title';
import { billingWarningsMessage } from '@/_lib/billingWarnings';
import { clientColumnDef, ClientFormData } from '@/_schema/client';
import { useState } from 'react';
import { useServerAction } from 'zsa-react';

interface TableClientsProps {
  data: ClientFormData[];
}

export default function TableClients({ data }: TableClientsProps) {
  const { execute: executeDelete } = useServerAction(actionDeleteClientsByUser);
  const [warning, setWarning] = useState<string | null>(null);

  return (
    <DefaultLayout>
      <Title
        label="Pessoas"
        styled="form"
        className="flex items-center justify-between border-b border-primary text-left py-1 flex-row"
      >
        <ButtonLink
          url="/restrict/clients/0"
          label="Adicionar"
          className="w-32"
        />
      </Title>
      {warning && (
        <p role="alert" className="text-sm text-destructive">
          {warning}
        </p>
      )}
      <div className="flex w-full h-full">
        <DataTable
          columns={clientColumnDef}
          data={data || []}
          pageSize={50}
          getEditLink={row => `/restrict/clients/${row.id}`}
          deleteAction={async row => {
            const [result] = await executeDelete({ id: row.id });
            return result;
          }}
          deleteWarning={() =>
            'Cobranças em aberto deste cliente serão canceladas.'
          }
          onDeleted={(_row, result: DeleteClientResult | undefined) => {
            setWarning(billingWarningsMessage(result?.billingWarnings ?? []));
          }}
        />
      </div>
    </DefaultLayout>
  );
}
