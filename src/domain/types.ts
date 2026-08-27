export type Status = 'OnTrack' | 'AtRisk' | 'Complete';

export interface Portfolio {
  id: string;
  name: string;
  objective: string;
  owner: string;
  identifiedPotential: number;
}

export interface Initiative {
  id: string;
  portfolioId: string;
  name: string;
  businessCase: string;
  estimatedSavings: number;
  actualSavings: number;
  status: Status;
  owner: string;
  startDate: string; // ISO date
  targetDate: string; // ISO date
}

export interface YearlyMilestone {
  year: number;
  target: number;
}

export interface BenchmarkSettings {
  overallTarget: number;
  yearlyMilestones: YearlyMilestone[];
}

export interface AppData {
  schemaVersion: number;
  portfolios: Portfolio[];
  initiatives: Initiative[];
  settings: BenchmarkSettings;
}
