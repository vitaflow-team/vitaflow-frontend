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
    {
      accessorKey: 'description2',
      header: 'Descrição2',
      cell: ({ row }) => {
        return <div>{row.getValue('description2')}</div>;
      },
      meta: {
        align: 'left',
        mobile: true,
      },
    },
  ];

  const workouts: workoutFormData[] = [
    {
      id: '1',
      description: 'description1',
      description2: 'description1',
    },
    {
      id: '2',
      description: 'description2',
      description2: 'description1',
    },
    {
      id: '3',
      description: 'description3',
      description2: 'description1',
    },
    {
      id: '4',
      description: 'description4',
      description2: 'description1',
    },
    {
      id: '5',
      description: 'description5',
      description2: 'description1',
    },
    {
      id: '6',
      description: 'description5',
      description2: 'description1',
    },
    {
      id: '7',
      description: 'description5',
      description2: 'description1',
    },
    {
      id: '8',
      description: 'description5',
      description2: 'description1',
    },
    {
      id: '9',
      description: 'description5',
      description2: 'description1',
    },
    {
      id: '10',
      description: 'description5',
      description2: 'description1',
    },
    {
      id: '11',
      description: 'description5',
      description2: 'description1',
    },
    {
      id: '12',
      description:
        'Fernando Cezar Vicari Fernando Cezar Vicari Fernando Cezar Vicari Fernando Cezar Vicari Fernando Cezar Vicari Fernando Cezar Vicari Fernando Cezar Vicari Fernando Cezar Vicari Fernando Cezar Vicari Fernando Cezar Vicari Fernando Cezar Vicari',
      description2: 'description1',
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
        <DataTable columns={columns} data={workouts} pageSize={6} />
      </div>
    </DefaultLayout>
  );
}
