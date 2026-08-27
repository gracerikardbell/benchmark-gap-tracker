import type { BenchmarkSettings, Initiative } from './types';

export interface GapToGoalPoint {
  year: number;
  /** Fixed benchmark ambition — top line. */
  benchmarkTarget: number;
  /** Momentum baseline (BAU / continuous improvement) plus initiative contribution — middle line. */
  currentTrajectory: number;
  /** Momentum baseline with no transformation initiatives — bottom line. */
  momentumCase: number;
}

/**
 * Builds the three-line gap-to-goal series through 2030:
 * 1. Benchmark Target — fixed yearly ambition from settings.yearlyMilestones
 * 2. Current Trajectory — momentum baseline + initiatives' actual (past) / projected (future) savings
 * 3. Momentum Case — the momentum/BAU baseline alone, with no transformation initiatives
 */
export function buildGapToGoalSeries(
  settings: BenchmarkSettings,
  initiatives: Initiative[],
  today: Date = new Date(),
): GapToGoalPoint[] {
  const currentYear = today.getFullYear();
  const totalActual = initiatives.reduce((sum, i) => sum + i.actualSavings, 0);
  const totalEstimated = initiatives.reduce((sum, i) => sum + i.estimatedSavings, 0);
  const lastMilestoneYear = settings.yearlyMilestones[settings.yearlyMilestones.length - 1]?.year ?? currentYear;
  const momentumByYear = new Map(settings.momentumTrajectory.map((m) => [m.year, m.target]));

  return settings.yearlyMilestones
    .slice()
    .sort((a, b) => a.year - b.year)
    .map(({ year, target }) => {
      let initiativeContribution: number;
      if (year <= currentYear) {
        initiativeContribution = totalActual;
      } else {
        const progress = Math.min(1, (year - currentYear) / Math.max(1, lastMilestoneYear - currentYear));
        initiativeContribution = totalActual + (totalEstimated - totalActual) * progress;
      }

      const momentumCase = momentumByYear.get(year) ?? 0;

      return {
        year,
        benchmarkTarget: target,
        currentTrajectory: momentumCase + initiativeContribution,
        momentumCase,
      };
    });
}

export function totalIdentified(initiatives: Initiative[]): number {
  return initiatives.reduce((sum, i) => sum + i.estimatedSavings, 0);
}

export function totalDelivered(initiatives: Initiative[]): number {
  return initiatives.reduce((sum, i) => sum + i.actualSavings, 0);
}
