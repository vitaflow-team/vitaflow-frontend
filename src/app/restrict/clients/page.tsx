'use client';

import { actionGetClientsByUser } from '@/_actions/getClientsByUser';
import DefaultLayout from '@/_components/layout/defaultLayout';
import { ButtonLink } from '@/_components/ui/buttonLink';
import { DataTable } from '@/_components/ui/dataTable';
import { Title } from '@/_components/ui/title';
import { clientColumnDef } from '@/_schema/client';
import { useEffect } from 'react';
import { useServerAction } from 'zsa-react';

export default function ClientsPage() {
  const { execute, data } = useServerAction(actionGetClientsByUser);

  useEffect(() => {
    execute();
  }, [execute]);

  return (
    <DefaultLayout>
      <Title
        label="Alunos/Pacientes"
        styled="form"
        className="flex items-center justify-between border-b border-primary text-left py-1 flex-row"
      >
        <ButtonLink
          url="/restrict/workouts/0"
          label="Adicionar"
          className="w-32"
        />
      </Title>
      <div className="flex w-full h-full">
        <DataTable columns={clientColumnDef} data={data || []} pageSize={50} />
      </div>
    </DefaultLayout>
  );
}
