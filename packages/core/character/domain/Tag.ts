export type Tag = string;

export interface ExtendedTag {
  name: string;
  value: number | string;
}
export const exampleTag: Tag = '俊足';

export const exampleExtendedTag: ExtendedTag = {
  name: '所持金',
  value: 1000,
};
