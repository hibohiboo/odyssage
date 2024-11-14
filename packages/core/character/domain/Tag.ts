export type Tag = { name: string };

export interface ExtendedTag extends Tag {
  value: number | string;
}
export const exampleTag: Tag = { name: '俊足' };

export const exampleExtendedTag: ExtendedTag = {
  name: '所持金',
  value: 1000,
};
