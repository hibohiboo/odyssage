export const SITE = { title: 'Doc', description: 'Comment thrower.', defaultLanguage: 'ja_JP' };

export const OPEN_GRAPH = {};

// This is the type of the frontmatter you put in the docs markdown files.
export type Frontmatter = {
  title: string;
  description: string;
  layout: string;
  image?: { src: string; alt: string };
  dir?: 'ltr' | 'rtl';
  ogLocale?: string;
  lang?: string;
};

export const KNOWN_LANGUAGES = { 日本語: 'ja' } as const;
export const KNOWN_LANGUAGE_CODES = Object.values(KNOWN_LANGUAGES);
export const GITHUB_EDIT_URL = `https://github.com/hkj-hub/odyssagetree/main/docs`;
export const BASE_PATH = 'odyssage';

export type Sidebar = Record<
  (typeof KNOWN_LANGUAGE_CODES)[number],
  Record<string, { text: string; link: string }[]>
>;
export const SIDEBAR: Sidebar = {
  ja: {
    目次: [
      { text: 'イントロダクション', link: `${BASE_PATH}/ja/introduction` },
      { text: '技術選定', link: `${BASE_PATH}/ja/application-architecture` },
    ],
    設定: [
      { text: 'GitHub Pages', link: `${BASE_PATH}/ja/settings/github/github-pages` },
    ],
  },
};
