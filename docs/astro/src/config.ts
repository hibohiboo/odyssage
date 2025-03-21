export const SITE = {
  title: 'Doc',
  description: 'Odyssage.',
  defaultLanguage: 'ja_JP',
};
export const BASE_PATH = 'odyssage';
export const SIDEBAR: Sidebar = {
  ja: {
    目次: [
      { text: 'イントロダクション', link: `${BASE_PATH}/ja/introduction` },
      {
        text: 'ビジョン',
        link: `${BASE_PATH}/ja/ddd/businessdomain/domain`,
      },
      {
        text: 'ユースケース',
        link: `${BASE_PATH}/ja/ddd/businessdomain/usecase`,
      },
      {
        text: 'Context Mapping',
        link: `${BASE_PATH}/ja/ddd/businessdomain/contextmap`,
      },
      { text: '技術選定', link: `${BASE_PATH}/ja/application-architecture` },
    ],
    開発用: [
      {
        text: 'Storybook',
        link: `${BASE_PATH}/odyssage-components/index.html`,
      },
      {
        text: 'APIリファレンス',
        link: `${BASE_PATH}/odyssage-openapi/`,
      },
      // {
      //   text: 'ふるまい駆動テストレポート',
      //   link: `${BASE_PATH}/odyssage-cucumber/`,
      // },
      {
        text: 'ホットスポットプロファイル',
        link: `${BASE_PATH}/crime-scene-hotspots/`,
      },
      // { text: 'Storybook', link: `${BASE_PATH}/odyssage-components/index.html` },
      // { text: 'Jestレポート', link: `${BASE_PATH}/odyssage-jest-reports/jest.html` },
      // {
      //   text: 'Jestカバレッジ',
      //   link: `${BASE_PATH}/odyssage-jest-coverage/lcov-report/index.html`,
      // },
      {
        text: 'ESLint Config Inspector',
        link: `${BASE_PATH}/odyssage-eslint-config-inspector/`,
      },
    ],
    設定: [
      {
        text: 'GitHub Pages',
        link: `${BASE_PATH}/ja/settings/github/github-pages`,
      },
    ],
  },
};
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
export const GITHUB_EDIT_URL = `https://github.com/hibohiboo/odyssage/tree/main/docs`;

export type Sidebar = Record<
  (typeof KNOWN_LANGUAGE_CODES)[number],
  Record<string, { text: string; link: string }[]>
>;
