'use client';

import { actionDeleteClientsByUser } from '@/_actions/clients/deleteClientsByUser';
import DefaultLayout from '@/_components/layout/defaultLayout';
import { ButtonLink } from '@/_components/ui/buttonLink';
import { DataTable } from '@/_components/ui/dataTable';
import { Title } from '@/_components/ui/title';
import { clientColumnDef, ClientFormData } from '@/_schema/client';
import { useServerAction } from 'zsa-react';

interface TableClientsProps {
  data: ClientFormData[];
}

export default function TableClients({ data }: TableClientsProps) {
  const { execute: executeDelete } = useServerAction(actionDeleteClientsByUser);

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
      <div className="flex w-full h-full">
        <DataTable
          columns={clientColumnDef}
          data={data || []}
          pageSize={50}
          getEditLink={row => `/restrict/clients/${row.id}`}
          deleteAction={async row => {
            await executeDelete({ id: row.id });
          }}
        />
      </div>
    </DefaultLayout>
  );
}
