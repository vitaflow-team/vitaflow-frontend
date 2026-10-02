import { SlotPicker } from '@/_components/scheduling/slotPicker';
import DefaultLayout from '@/_components/layout/defaultLayout';
import { PAGE_TITLES } from '@/_constants/pageTitles';
import { isLoadFailure, loadEligibleCounterparts } from '@/_lib/messagesData';
import { auth } from '@/auth';
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { z } from 'zod';

export const metadata: Metadata = {
  title: PAGE_TITLES.schedulingBook,
};

const uuidSchema = z.uuid();

interface BookPageProps {
  params: Promise<{ professionalId: string }>;
}

/** US-005/US-006: the slot picker for one specific, eligible professional. */
export default async function BookPage({ params }: BookPageProps) {
  const session = await auth();
  if (!session?.user?.id) return null;

  const { professionalId } = await params;
  if (!uuidSchema.safeParse(professionalId).success) notFound();

  const eligible = await loadEligibleCounterparts(false);
  const professional = isLoadFailure(eligible)
    ? undefined
    : eligible.find(candidate => candidate.id === professionalId);

  if (!professional) notFound();

  return (
    <DefaultLayout>
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-1 border-b border-primary pb-3">
          <Link
            href="/restrict/scheduling"
            className="text-primary w-fit text-sm underline-offset-4 hover:underline"
          >
            ← Voltar para Agendar horário
          </Link>
          <h1 className="text-2xl font-semibold">{professional.name}</h1>
        </div>

        <SlotPicker
          professionalId={professional.id}
          professionalName={professional.name}
        />
      </div>
    </DefaultLayout>
  );
}
