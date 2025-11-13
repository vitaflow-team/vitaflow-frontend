'use client';
import DefaultLayout from '@/_components/layout/defaultLayout';
import { ButtonLink } from '@/_components/ui/buttonLink';
import { DataTable } from '@/_components/ui/dataTable';
import { Title } from '@/_components/ui/title';
import { workoutColumnDef, workoutFormData } from '@/_schema/workout';

export default function WorkoutsPage() {
  const workoutsData: workoutFormData[] = [];

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
        <DataTable
          columns={workoutColumnDef}
          data={workoutsData}
          pageSize={50}
        />
      </div>
    </DefaultLayout>
  );
}
