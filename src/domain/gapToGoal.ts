import type { BenchmarkSettings, Initiative } from './types';

export interface GapToGoalPoint {
  year: number;
  targetCumulative: number;
  actualProjectedCumulative: number;
}

/**
 * Builds a yearly series of cumulative benchmark target vs. cumulative
 * actual+projected savings, through 2030. Past/current years use actual
 * savings realized to date; future years linearly project from estimated
 * savings weighted by each initiative's timeline.
 */
export function buildGapToGoalSeries(
  settings: BenchmarkSettings,
  initiatives: Initiative[],
  today: Date = new Date(),
): GapToGoalPoint[] {
  const currentYear = today.getFullYear();
  const totalActual = initiatives.reduce((sum, i) => sum + i.actualSavings, 0);
  const totalEstimated = initiatives.reduce((sum, i) => sum + i.estimatedSavings, 0);

  return settings.yearlyMilestones
    .slice()
    .sort((a, b) => a.year - b.year)
    .map(({ year, target }) => {
      let actualProjectedCumulative: number;
      if (year <= currentYear) {
        actualProjectedCumulative = totalActual;
      } else {
        const lastMilestoneYear = settings.yearlyMilestones[settings.yearlyMilestones.length - 1].year;
        const progress = Math.min(
          1,
          (year - currentYear) / Math.max(1, lastMilestoneYear - currentYear),
        );
        actualProjectedCumulative = totalActual + (totalEstimated - totalActual) * progress;
      }
      return { year, targetCumulative: target, actualProjectedCumulative };
    });
}

export function totalIdentified(initiatives: Initiative[]): number {
  return initiatives.reduce((sum, i) => sum + i.estimatedSavings, 0);
}

export function totalDelivered(initiatives: Initiative[]): number {
  return initiatives.reduce((sum, i) => sum + i.actualSavings, 0);
}
