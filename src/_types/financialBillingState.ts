/** Where the owner's payment account stands, independent of any figures. */
export type FinancialBillingState =
  | 'NOT_CONNECTED'
  | 'CONNECTED'
  | 'RECONNECT_NEEDED';
