# Odyssage - Claude開発支援ドキュメント

## プロジェクト概要

Odyssage は、TRPGセッション管理のためのWebアプリケーションです。
React + TypeScript (フロントエンド) と Hono.js + Cloudflare Workers (バックエンド) で構成されています。

## 開発時の品質保証手順

実装完了後は必ず以下の手順で品質チェックを実行し、全てのエラーを解消してから作業完了とすること。

### 1. 基本品質チェック

```bash
# フロントエンド
cd apps/frontend
npm run lint      # ESLintチェック
npm run build     # ビルドエラーチェック + TypeScript型チェック

# バックエンド  
cd apps/backend
bun run lint      # ESLintチェック
bunx tsc --noEmit # TypeScript型チェック
```

### 2. エラー修正の基本方針

#### ESLintエラー対応
- **import順序エラー**: ESLintの`import/order`ルールに従って修正
- **関数複雑度エラー**: 関数を小さな関数に分割（複雑度7以下を目標）
- **any型エラー**: テストファイルでは許容（`.test.ts`、`.test.tsx`）、本体コードでは具体的な型を定義

#### TypeScriptエラー対応
- **型の不整合**: APIレスポンス型と実際のレスポンスを確認し、型定義を修正
- **モック型エラー**: テストでのモックオブジェクトには適切な型注釈を付与
- **プロパティ不足**: インターフェースの必須プロパティを全て実装

#### ビルドエラー対応
- **依存関係エラー**: package.jsonの依存関係を確認・更新
- **パスエラー**: import/exportパスの大文字小文字、拡張子を確認

### 3. よくあるエラーパターンと解決法

#### ESLint設定によるテストファイル例外設定
```javascript
// eslint.config.js
{
  files: ['**/tests/**','**/*.test.tsx','**/*.test.ts','vitest.config.ts'],
  rules: {
    '@typescript-eslint/no-explicit-any': ['off'],
    'import/no-extraneous-dependencies': ['off'],
    // その他テスト専用ルール
  },
}
```

#### 複雑度エラーの関数分割パターン
```typescript
// 修正前: 複雑度が高い単一関数
const handleSubmit = async (data) => {
  // 複雑な処理（複雑度9）
};

// 修正後: 処理を分割
const processData = async (data) => {
  // 一部の処理を分離
};

const handleSubmit = async (data) => {
  // 簡潔な処理（複雑度4）
  await processData(data);
};
```

#### モック型定義の強化
```typescript
// テストファイルでの型安全なモック
const mockFunction = {
  trigger: vi.fn(),
  isMutating: false,
  error: undefined as Error | undefined, // 明示的な型定義
  reset: vi.fn(),
  data: undefined,
};
```

### 4. 修正順序の推奨フロー

1. **ESLintエラー修正**: 構文・スタイルの問題を解決
2. **TypeScript型エラー修正**: 型の整合性を確保  
3. **ビルドエラー修正**: 依存関係・パスの問題を解決
4. **再実行・確認**: 全チェックが成功することを確認

### 5. エラー解消の確認方法

修正完了後、必ず以下で全エラーが解消されていることを確認：

```bash
# 成功例
npm run lint
# → エラー0件で正常完了

npm run build  
# → "✓ built in X.XXs" で正常完了
```

### 6. 作業証跡の記録

品質保証作業の実施内容は開発証跡ファイル（`docs/development/`）に記録すること：

- 発生したエラーの内容
- 修正方法と技術的判断
- 修正結果（lint/build成功の確認）

## 関連ファイル

- `apps/frontend/eslint.config.js`: フロントエンドESLint設定
- `apps/backend/eslint.config.js`: バックエンドESLint設定  
- `tsconfig.json`: TypeScript設定
- `docs/development/`: 開発証跡ファイル保存場所

## 参考情報

### プロジェクト構成
- **フロントエンド**: React + TypeScript + Vite
- **バックエンド**: Hono.js + Cloudflare Workers  
- **データベース**: PostgreSQL (Neon) + Neo4j
- **認証**: Firebase Authentication
- **テスト**: Vitest + Playwright

### 開発環境起動
```bash
# 依存関係インストール
bun install

# ローカル環境起動
npm run local:all    # 全サービス起動
npm run dev:frontend # フロントエンド開発サーバー
npm run dev:backend  # バックエンド開発サーバー
```