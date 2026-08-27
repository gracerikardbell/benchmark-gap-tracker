import type { Initiative, Portfolio } from './types';
import { isInitiativeAtRisk, isPortfolioAtRisk } from './risk';

export interface PortfolioRollup {
  portfolio: Portfolio;
  initiativeCount: number;
  identifiedPotential: number;
  estimatedSavings: number;
  actualSavings: number;
  atRiskCount: number;
  onTrackPercent: number;
  isAtRisk: boolean;
}

export function computeRollup(
  portfolio: Portfolio,
  allInitiatives: Initiative[],
  today: Date = new Date(),
): PortfolioRollup {
  const initiatives = allInitiatives.filter((i) => i.portfolioId === portfolio.id);
  const atRiskCount = initiatives.filter((i) => isInitiativeAtRisk(i, today)).length;
  const initiativeCount = initiatives.length;
  const onTrackPercent =
    initiativeCount === 0 ? 100 : Math.round(((initiativeCount - atRiskCount) / initiativeCount) * 100);

  return {
    portfolio,
    initiativeCount,
    identifiedPotential: portfolio.identifiedPotential,
    estimatedSavings: initiatives.reduce((sum, i) => sum + i.estimatedSavings, 0),
    actualSavings: initiatives.reduce((sum, i) => sum + i.actualSavings, 0),
    atRiskCount,
    onTrackPercent,
    isAtRisk: isPortfolioAtRisk(portfolio, allInitiatives, today),
  };
}

export function computeAllRollups(
  portfolios: Portfolio[],
  initiatives: Initiative[],
  today: Date = new Date(),
): PortfolioRollup[] {
  return portfolios.map((p) => computeRollup(p, initiatives, today));
}

export function filterByOwner<T extends { owner: string }>(items: T[], owner: string | null): T[] {
  if (!owner) return items;
  return items.filter((i) => i.owner === owner);
}

export function uniqueOwners(portfolios: Portfolio[], initiatives: Initiative[]): string[] {
  const owners = new Set<string>();
  portfolios.forEach((p) => owners.add(p.owner));
  initiatives.forEach((i) => owners.add(i.owner));
  return Array.from(owners).sort();
}
