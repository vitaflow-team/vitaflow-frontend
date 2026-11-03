export type InvoiceStatus =
  | 'PENDING'
  | 'OVERDUE'
  | 'PAID'
  | 'PAID_MANUALLY'
  | 'CANCELED';

export type FinancialSituation = 'OVERDUE' | 'PENDING' | 'UP_TO_DATE' | 'NONE';

export type BillingAccountStatus =
  | 'NOT_CONNECTED'
  | 'CONNECTED'
  | 'RECONNECT_NEEDED';

export interface BillingAccount {
  premium: boolean;
  connected: boolean;
  status: BillingAccountStatus;
  accountName: string | null;
  openInvoiceCount: number;
}

export interface Invoice {
  id: string;
  competenceYear: number;
  competenceMonth: number;
  amountCents: number;
  dueDate: string;
  status: InvoiceStatus;
  paidAt: string | null;
  paidAmountCents: number | null;
  manualNote: string | null;
  paymentUrl: string | null;
  canResendAt: string | null;
  /** Only present on the invoice just created. */
  emailSent?: boolean;
}

export interface TaxId {
  present: boolean;
  masked: string | null;
}

export interface InvoiceList {
  items: Invoice[];
  total: number;
  page: number;
  pageSize: number;
  situation: FinancialSituation;
  taxId: TaxId;
  gateway: { connected: boolean; premium: boolean };
}

export interface BillingWarning {
  competenceYear: number;
  competenceMonth: number;
}
