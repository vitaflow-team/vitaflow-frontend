'use client';
import DefaultLayout from '@/_components/layout/defaultLayout';
import { ButtonLink } from '@/_components/ui/buttonLink';
import { DataTable } from '@/_components/ui/dataTable';
import { Title } from '@/_components/ui/title';
import { workoutFormData } from '@/_schema/workout';
import { ColumnDef } from '@tanstack/react-table';

export default function WorkoutsPage() {
  const columns: ColumnDef<workoutFormData>[] = [
    {
      accessorKey: 'id',
      header: 'ID',
      cell: ({ row }) => {
        return <div>{row.getValue('id')}</div>;
      },
      size: 60,
      minSize: 60,
      meta: {
        align: 'right',
        mobile: false,
      },
    },
    {
      accessorKey: 'description',
      header: 'Descrição',
      cell: ({ row }) => {
        return <div>{row.getValue('description')}</div>;
      },
      meta: {
        align: 'left',
        mobile: true,
      },
    },
  ];

  const workouts: workoutFormData[] = [];

  return (
    <DefaultLayout>
      <Title
        label="Treinos"
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
        <DataTable columns={columns} data={workouts} pageSize={6} />
      </div>
    </DefaultLayout>
  );
}
