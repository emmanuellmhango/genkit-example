export interface SeriesAnalysis {
  count: number;
  mean: number;
  min: number;
  max: number;
  variance: number;
  slope: number;
  trend: 'increasing' | 'decreasing' | 'stable';
}

export function analyzeSeries(values: number[]): SeriesAnalysis {
  const n = values.length;

  const mean =
    values.reduce((sum, v) => sum + v, 0) / n;

  const min = Math.min(...values);
  const max = Math.max(...values);

  const variance =
    values.reduce((sum, v) => sum + (v - mean) ** 2, 0) / n;

  // Linear regression slope
  const xMean = (n - 1) / 2;

  const slopeNumerator = values.reduce((sum, y, i) => {
    return sum + (i - xMean) * (y - mean);
  }, 0);

  const slopeDenominator = values.reduce((sum, _, i) => {
    return sum + (i - xMean) ** 2;
  }, 0);

  const slope = slopeNumerator / slopeDenominator;

  let trend: 'increasing' | 'decreasing' | 'stable' = 'stable';

  if (slope > 0.01) trend = 'increasing';
  if (slope < -0.01) trend = 'decreasing';

  return {
    count: n,
    mean: Number(mean.toFixed(3)),
    min,
    max,
    variance: Number(variance.toFixed(3)),
    slope: Number(slope.toFixed(4)),
    trend,
  };
}
