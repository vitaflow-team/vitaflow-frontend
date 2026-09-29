/** How the trend chart names, colors and formats one metric. */
export interface TrendMetricConfig {
  /** Metric name inside the accessible sentence. */
  label: string;
  unit: string;
  /** Color token of the line and the fill — both 3:1 against --card. */
  color: string;
  /**
   * The vertical axis ticks carry only the number; the unit shows in the
   * tooltip, the accessible summary and the hidden table, saving width on
   * mobile.
   */
  axisWidth: number;
  format: (value: number) => string;
}
