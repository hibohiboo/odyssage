export type ScenarioStatus = 'published' | 'draft' | 'private';

export interface Scenario {
  readonly id: string;
  readonly title: string;
  readonly description: string;
  readonly updatedAt: string;
  readonly status: ScenarioStatus;
  readonly usedByGMs: number;
  readonly tags: string[];
}
