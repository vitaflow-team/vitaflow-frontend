'use client';

import { actionDeleteClientsByUser } from '@/_actions/clients/deleteClientsByUser';
import { actionGetClientsByUser } from '@/_actions/clients/getClientsByUser';
import DefaultLayout from '@/_components/layout/defaultLayout';
import { ButtonLink } from '@/_components/ui/buttonLink';
import { DataTable } from '@/_components/ui/dataTable';
import { Title } from '@/_components/ui/title';
import { clientColumnDef } from '@/_schema/client';
import { useEffect } from 'react';
import { useServerAction } from 'zsa-react';

export default function ClientsPage() {
  const { execute, data } = useServerAction(actionGetClientsByUser);
  const { execute: executeDelete } = useServerAction(actionDeleteClientsByUser);

  useEffect(() => {
    execute();
  }, [execute]);

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
            execute();
          }}
        />
      </div>
    </DefaultLayout>
  );
}
