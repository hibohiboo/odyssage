export type Scenario = {
  id: string;
  status: 'published' | 'draft' | 'private';
  title: string;
  description: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  usedByGMs: number;
};
