import DefaultLayout from '@/_components/layout/defaultLayout';
import FormWorkout from './formWorkout';

export default async function WorkoutsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  if (id !== '0') {
    console.log('buscar usuário');
  }

  return (
    <DefaultLayout>
      <FormWorkout />
    </DefaultLayout>
  );
}
