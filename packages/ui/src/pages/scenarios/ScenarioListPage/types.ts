export type ScenarioStatus = 'published' | 'draft' | 'private';

export interface Scenario {
  id: string;
  title: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  status: ScenarioStatus;
  usedByGMs: number;
  tags: string[];
}
