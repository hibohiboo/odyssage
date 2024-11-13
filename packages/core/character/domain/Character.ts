import { ExtendedTag, Tag } from './Tag';

export interface CharacterProps {
  id: string;
  name: string;
  tags: Tag[];
  extendedTags: ExtendedTag[];
  description?: string;
}
export class Character {
  public id: string;

  public name: string;

  public tags: Tag[];

  public extendedTags: ExtendedTag[];

  public description?: string;

  constructor(props: CharacterProps) {
    this.id = props.id;
    this.name = props.name;
    this.tags = props.tags;
    this.extendedTags = props.extendedTags;
    this.description = props.description;
  }

  getExtendedTagValue: (tagName: string) => number | string | undefined = (
    tagName: string,
  ) => {
    const tag = this.extendedTags.find((t) => t.name === tagName);
    return tag?.value;
  };
}
