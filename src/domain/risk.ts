import type { Initiative, Portfolio } from './types';

/** Midpoint between startDate and targetDate, in ms since epoch. */
function halfwayPointMs(initiative: Initiative): number {
  const start = new Date(initiative.startDate).getTime();
  const target = new Date(initiative.targetDate).getTime();
  return start + (target - start) / 2;
}

export function isInitiativeAtRisk(initiative: Initiative, today: Date = new Date()): boolean {
  if (initiative.status === 'AtRisk') return true;
  if (initiative.status === 'Complete') return false;

  const pastHalfway = today.getTime() >= halfwayPointMs(initiative);
  if (!pastHalfway) return false;

  const threshold = 0.5 * initiative.estimatedSavings;
  return initiative.actualSavings < threshold;
}

export function isPortfolioAtRisk(
  portfolio: Portfolio,
  initiatives: Initiative[],
  today: Date = new Date(),
): boolean {
  return initiatives
    .filter((i) => i.portfolioId === portfolio.id)
    .some((i) => isInitiativeAtRisk(i, today));
}

export function atRiskReason(initiative: Initiative, today: Date = new Date()): string {
  if (initiative.status === 'AtRisk') return 'Manually flagged at risk';
  const pastHalfway = today.getTime() >= halfwayPointMs(initiative);
  if (pastHalfway && initiative.actualSavings < 0.5 * initiative.estimatedSavings) {
    return 'Actual savings below 50% of estimate past the halfway point to target date';
  }
  return '';
}
