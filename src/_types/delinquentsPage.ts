import type { DelinquentRow } from './delinquentRow';

/** `GET /financial-health/delinquents` — one page of delinquent people. */
export interface DelinquentsPage {
  items: DelinquentRow[];
  page: number;
  pageSize: number;
  total: number;
}
