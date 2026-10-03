/** One plotted point: a timestamp in milliseconds and its value. */
export interface ChartPoint {
  t: number;
  value: number;
  /** Set when an educator measured this point. */
  educatorName?: string;
}
