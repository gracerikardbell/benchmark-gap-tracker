import { describe, expect, it } from 'vitest';
import { buildGapToGoalSeries } from './gapToGoal';
import type { BenchmarkSettings, Initiative } from './types';

const settings: BenchmarkSettings = {
  overallTarget: 1000,
  yearlyMilestones: [
    { year: 2024, target: 200 },
    { year: 2025, target: 500 },
    { year: 2026, target: 1000 },
  ],
  momentumTrajectory: [
    { year: 2024, target: 50 },
    { year: 2025, target: 100 },
    { year: 2026, target: 150 },
  ],
};

const initiatives: Initiative[] = [
  {
    id: 'i1',
    portfolioId: 'p1',
    name: 'A',
    businessCase: '',
    estimatedSavings: 800,
    actualSavings: 300,
    status: 'OnTrack',
    owner: 'Owner',
    startDate: '2023-01-01',
    targetDate: '2026-01-01',
  },
];

describe('buildGapToGoalSeries', () => {
  it('returns one point per yearly milestone, sorted ascending', () => {
    const series = buildGapToGoalSeries(settings, initiatives, new Date('2025-01-01'));
    expect(series.map((p) => p.year)).toEqual([2024, 2025, 2026]);
  });

  it('ramps delivered contribution from 0 at the first milestone year to actuals at today', () => {
    const series = buildGapToGoalSeries(settings, initiatives, new Date('2026-01-01'));
    const point2024 = series.find((p) => p.year === 2024)!;
    const point2025 = series.find((p) => p.year === 2025)!;
    const point2026 = series.find((p) => p.year === 2026)!;
    // ramp: 2024 -> 0% of actual, 2025 -> 50%, 2026 (today) -> 100%
    expect(point2024.currentTrajectory).toBe(50 + 0);
    expect(point2025.currentTrajectory).toBe(100 + 150);
    expect(point2026.currentTrajectory).toBe(150 + 300);
  });

  it('projects toward total estimated savings plus momentum for future years', () => {
    const series = buildGapToGoalSeries(settings, initiatives, new Date('2024-01-01'));
    const point2026 = series.find((p) => p.year === 2026)!;
    expect(point2026.currentTrajectory).toBe(150 + 800);
  });

  it('exposes benchmark target and momentum case directly', () => {
    const series = buildGapToGoalSeries(settings, initiatives, new Date('2024-01-01'));
    const point2025 = series.find((p) => p.year === 2025)!;
    expect(point2025.benchmarkTarget).toBe(500);
    expect(point2025.momentumCase).toBe(100);
  });
});


