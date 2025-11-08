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
      },
    },
  ];

  const workouts: workoutFormData[] = [
    {
      id: '1',
      description: 'description1',
    },
    {
      id: '2',
      description: 'description2',
    },
    {
      id: '3',
      description: 'description3',
    },
    {
      id: '4',
      description: 'description4',
    },
    {
      id: '5',
      description: 'description5',
    },
    {
      id: '6',
      description: 'description5',
    },
    {
      id: '7',
      description: 'description5',
    },
    {
      id: '8',
      description: 'description5',
    },
    {
      id: '9',
      description: 'description5',
    },
    {
      id: '10',
      description: 'description5',
    },
    {
      id: '11',
      description: 'description5',
    },
    {
      id: '12',
      description:
        'Fernando Cezar Vicari Fernando Cezar Vicari Fernando Cezar Vicari Fernando Cezar Vicari Fernando Cezar Vicari Fernando Cezar Vicari Fernando Cezar Vicari Fernando Cezar Vicari Fernando Cezar Vicari Fernando Cezar Vicari Fernando Cezar Vicari',
    },
  ];

  return (
    <DefaultLayout>
      <Title
        label="Treinos"
        className="flex items-center justify-between border-b border-primary text-left py-1"
      >
        <ButtonLink
          url="/restrict/workouts/null"
          label="Adicionar"
          className="w-32"
        />
      </Title>
      <div className="flex w-full h-full ">
        <DataTable columns={columns} data={workouts} />
      </div>
    </DefaultLayout>
  );
}
