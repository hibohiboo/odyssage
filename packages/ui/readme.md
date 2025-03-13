*   `private`: `true` になっているので、このパッケージは npm に公開できない（社内・個人プロジェクト向け）。
*   `"build"`: `tsup` で TypeScript のビルドを行う（Tsup は高速な TypeScript バンドラー）。
*   `react` と `react-dom` は `peerDependencies` に指定されており、**このパッケージを利用するプロジェクトが自前で用意する** ことを期待している。
    *   `peerDependencies` にすることで、UI コンポーネントライブラリの使用時に React のバージョン衝突を防ぐ。
*   `main`: CommonJS 形式のエントリーポイント（`dist/index.js`）。
*   `module`: ESM（ES Modules）形式のエントリーポイント（`dist/index.mjs`）。
*   `types`: TypeScript の型定義ファイル（`dist/index.d.ts`）。
*   `files`: `"dist/**"` になっており、ビルド後の `dist/` ディレクトリのみを含める。
