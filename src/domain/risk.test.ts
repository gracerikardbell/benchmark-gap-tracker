import { describe, expect, it } from 'vitest';
import { isInitiativeAtRisk } from './risk';
import type { Initiative } from './types';

function makeInitiative(overrides: Partial<Initiative>): Initiative {
  return {
    id: 'test-1',
    portfolioId: 'test-portfolio',
    name: 'Test Initiative',
    businessCase: 'Test',
    estimatedSavings: 1000,
    actualSavings: 1000,
    status: 'OnTrack',
    owner: 'Test Owner',
    startDate: '2024-01-01',
    targetDate: '2026-01-01',
    ...overrides,
  };
}

describe('isInitiativeAtRisk', () => {
  it('is not at risk before the halfway point even with low actuals', () => {
    const initiative = makeInitiative({ actualSavings: 0 });
    const today = new Date('2024-06-01'); // before 2025-01-01 halfway point
    expect(isInitiativeAtRisk(initiative, today)).toBe(false);
  });

  it('is at risk past halfway point when actual < 50% of estimate', () => {
    const initiative = makeInitiative({ estimatedSavings: 1000, actualSavings: 400 });
    const today = new Date('2025-06-01'); // after 2025-01-01 halfway point
    expect(isInitiativeAtRisk(initiative, today)).toBe(true);
  });

  it('is not at risk past halfway point when actual >= 50% of estimate', () => {
    const initiative = makeInitiative({ estimatedSavings: 1000, actualSavings: 500 });
    const today = new Date('2025-06-01');
    expect(isInitiativeAtRisk(initiative, today)).toBe(false);
  });

  it('is at risk when manually flagged regardless of savings', () => {
    const initiative = makeInitiative({ status: 'AtRisk', actualSavings: 1000 });
    const today = new Date('2024-01-02');
    expect(isInitiativeAtRisk(initiative, today)).toBe(true);
  });

  it('is never at risk when complete', () => {
    const initiative = makeInitiative({ status: 'Complete', actualSavings: 0 });
    const today = new Date('2027-01-01');
    expect(isInitiativeAtRisk(initiative, today)).toBe(false);
  });
});
