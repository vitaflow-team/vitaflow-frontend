import { BillingTab } from '@/_components/billing/billingTab';
import type { InvoiceList } from '@/_types/billing';
import type { LoadFailure } from '@/_types/loadFailure';

interface GymStudentBillingProps {
  clientId: string;
  invoices: InvoiceList | LoadFailure;
}

/** The student's monthly fees on the gym student screen: mark paid, resend and cancel, as in the professionals' billing tab (US-016). */
export function GymStudentBilling({
  clientId,
  invoices,
}: GymStudentBillingProps) {
  return (
    <section
      aria-labelledby="gym-student-billing-heading"
      className="flex flex-col gap-3"
    >
      <h2 id="gym-student-billing-heading" className="text-lg font-semibold">
        Cobrança
      </h2>
      <BillingTab
        clientId={clientId}
        basePath={`/restrict/academia-alunos/${encodeURIComponent(clientId)}`}
        invoices={invoices}
        audience="GYM"
      />
    </section>
  );
}
