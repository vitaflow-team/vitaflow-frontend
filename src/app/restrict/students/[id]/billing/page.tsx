import { BillingTab } from '@/_components/billing/billingTab';
import { PAGE_TITLES } from '@/_constants/pageTitles';
import { loadStudentInvoices } from '@/_lib/billingData';
import { isLoadFailure, loadStudent } from '@/_lib/studentsData';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: PAGE_TITLES.student,
};

interface StudentBillingPageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ page?: string }>;
}

/** "Cobrança": the student's invoices and the generation panel (ADR-004). */
export default async function StudentBillingPage({
  params,
  searchParams,
}: StudentBillingPageProps) {
  const { id } = await params;
  const student = await loadStudent(id);
  if (isLoadFailure(student)) return null;

  const { page: pageParam } = await searchParams;
  const page = Number(pageParam) || 1;
  const invoices = await loadStudentInvoices(student.id, page);

  return (
    <BillingTab
      clientId={student.id}
      basePath={`/restrict/students/${student.id}/billing`}
      invoices={invoices}
    />
  );
}
