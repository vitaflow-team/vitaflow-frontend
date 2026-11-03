import { BillingTab } from '@/_components/billing/billingTab';
import { PAGE_TITLES } from '@/_constants/pageTitles';
import { loadStudentInvoices } from '@/_lib/billingData';
import { isLoadFailure, loadPatient } from '@/_lib/patientsData';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: PAGE_TITLES.patientBilling,
};

interface PatientBillingPageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ page?: string }>;
}

/** "Cobranças": the same billing screen as the educator's, for the nutritionist's patient (US-013, ADR-004). */
export default async function PatientBillingPage({
  params,
  searchParams,
}: PatientBillingPageProps) {
  const { id } = await params;
  const patient = await loadPatient(id);
  if (isLoadFailure(patient)) return null;

  const { page: pageParam } = await searchParams;
  const page = Number(pageParam) || 1;
  const invoices = await loadStudentInvoices(patient.id, page);

  return (
    <BillingTab
      clientId={patient.id}
      basePath={`/restrict/patients/${patient.id}/cobranca`}
      invoices={invoices}
    />
  );
}
