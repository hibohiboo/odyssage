import { ExtendedTag, Tag } from './Tag';

export interface Character {
  id: string;
  name: string;
  tags: Tag[];
  extendedTags: ExtendedTag[];
  description?: string;
}
