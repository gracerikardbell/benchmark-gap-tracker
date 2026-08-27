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

  it('uses actual savings for years at or before today', () => {
    const series = buildGapToGoalSeries(settings, initiatives, new Date('2025-01-01'));
    const point2024 = series.find((p) => p.year === 2024)!;
    const point2025 = series.find((p) => p.year === 2025)!;
    expect(point2024.actualProjectedCumulative).toBe(300);
    expect(point2025.actualProjectedCumulative).toBe(300);
  });

  it('projects toward total estimated savings for future years', () => {
    const series = buildGapToGoalSeries(settings, initiatives, new Date('2024-01-01'));
    const point2026 = series.find((p) => p.year === 2026)!;
    expect(point2026.actualProjectedCumulative).toBe(800);
  });
});
