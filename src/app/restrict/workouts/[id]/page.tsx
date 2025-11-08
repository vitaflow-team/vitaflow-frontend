import DefaultLayout from '@/_components/layout/defaultLayout';
import FormWorkout from './formWorkout';

export default async function WorkoutsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <DefaultLayout>
      <span>{id}</span>
      <FormWorkout />
    </DefaultLayout>
  );
}
