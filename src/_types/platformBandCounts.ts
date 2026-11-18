/** Delinquent subscribers per aging band, by their oldest overdue payment; the three add up to the list total. */
export interface PlatformBandCounts {
  d1to7: number;
  d8to30: number;
  d31Plus: number;
}
