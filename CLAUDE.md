# Odyssage - Claude開発支援ドキュメント

## プロジェクト概要

Odyssage は、TRPGセッション管理のためのWebアプリケーションです。
React + TypeScript (フロントエンド) と Hono.js + Cloudflare Workers (バックエンド) で構成されています。

## 開発手順

### Phase 1: 計画・設計段階

#### 1. 証跡ファイルの作成
新機能開発時は必ず以下の場所に証跡ファイルを作成：

```bash
# 証跡ファイル作成場所
docs/development/[機能名]-implementation.md

# 例
docs/development/scenario-graphdb-implementation.md
docs/development/user-authentication-implementation.md
```

#### 2. 証跡ファイルの基本構成
```markdown
# [機能名]の実装

## プロジェクト概要
- 機能の目的と背景
- 実装する機能の範囲

## アーキテクチャ分析
### 現在のシステム構成
- 関連する既存コンポーネント
- 技術スタック
- 既存のAPIパターン

## データモデル設計
- データベース設計
- API設計
- 型定義

## 実装計画
### TODO LIST
- [ ] 具体的なタスク1
- [ ] 具体的なタスク2
- [ ] テストファイル作成
- [ ] 統合テスト実行

## 実装ガイドライン
- コーディング指針
- テスト戦略
- 品質保証手順

## 進捗記録
### YYYY-MM-DD
- [x] 完了したタスク
- 設計判断の記録
- 技術的課題と解決方法

## 参考情報
- 関連ファイル
- 開発環境
```

#### 3. 作業設計の実施
証跡ファイル作成後、以下を明確にしてから実装開始：

1. **既存システム調査**: 
   - 関連コンポーネントの把握
   - 既存APIパターンの確認
   - 技術スタックの理解

2. **詳細設計**:
   - **データモデル設計**: データベーススキーマ、関係性設計
   - **OpenAPI仕様書作成**: バックエンドAPIの場合（`docs/redocly/openapi/`）
   - **API仕様設計**: リクエスト/レスポンス型定義
   - **コンポーネント設計**: フロントエンド画面・状態設計

3. **実装計画**:
   - 作業の分割・優先順位付け
   - テスト戦略の策定
   - リスク要因の洗い出し

### Phase 2: 実装段階

#### 1. 設計・仕様書作成
バックエンド機能実装時は以下の順序で設計書を作成：

```bash
# 設計順序
1. データモデル設計（証跡ファイル内）
2. OpenAPI仕様書作成（docs/redocly/openapi/paths/）
3. スキーマ定義（packages/schema/src/schema.ts）
4. テストファイル作成（*.test.ts, *.spec.ts）
```

**OpenAPI仕様書の場所**:
```bash
docs/redocly/openapi/
├── api.yaml                    # メインAPI定義
├── paths/                      # エンドポイント定義
│   ├── [新機能].yaml          # 新規エンドポイント
│   └── existing-endpoints.yaml
└── components/
    └── schemas/                # 共通スキーマ定義
```

**データベース設計ドキュメント**:
```bash
docs/architecture/
├── database-design.md          # 全体DB設計
└── [機能名]-db-schema.md      # 機能別スキーマ詳細
```

#### 2. テストファースト開発
```bash
# 実装順序
1. OpenAPI仕様書作成 (docs/redocly/openapi/paths/)
2. スキーマ定義 (packages/schema/)
3. テストファイル作成 (*.test.ts, *.spec.ts)
4. 実装コード作成
5. 統合テスト実行
```

#### 3. 実装時の原則
- **OpenAPI First**: バックエンドAPIは必ずOpenAPI仕様書を先に定義
- **スキーマ駆動開発**: Valibotスキーマでリクエスト/レスポンス検証を実装
- **既存パターンの踏襲**: 既存のコード規約・パターンに従う
- **段階的実装**: 小さい単位で実装し、都度動作確認
- **証跡の継続更新**: 設計判断・課題・解決策を随時記録

#### 4. データベース設計の原則
- **既存テーブルとの整合性**: 命名規則、型定義、関係性を既存DBに合わせる
- **制約定義**: データ整合性確保のためのPRIMARY KEY、FOREIGN KEY、CHECK制約
- **マイグレーション考慮**: スキーマ変更時の影響範囲を事前評価
- **インデックス設計**: パフォーマンス問題が実際に発生してから検討（初期実装では不要）

#### 5. 進捗の可視化
証跡ファイルのTODO LISTを継続更新：
```markdown
### 実装完了項目
- [x] バックエンドAPI実装
- [x] フロントエンド画面実装
- [x] 統合テスト実行

### 現在作業中
- [ ] エラーハンドリング強化 (in progress)

### 未着手
- [ ] パフォーマンス最適化
```

### Phase 3: 品質保証・完了段階

#### 1. 必須チェック項目
実装完了前に必ず実施：

```bash
# テスト実行
npm run test              # 単体テスト
npm run test:integration  # 統合テスト (該当する場合)

# 品質チェック
npm run lint             # ESLint
npm run build            # ビルド + 型チェック
```

#### 2. 証跡ファイルの完了記録
```markdown
### 最終完了状況
- [x] 全機能実装完了
- [x] テスト実行・成功確認
- [x] Lint・ビルドエラー解消
- [x] 動作確認完了

### 技術的解決事項
1. **課題**: 具体的な技術課題
   - **解決方法**: 採用した解決策
   - **理由**: 判断根拠

### 今後の拡張予定
- Phase 4: 追加機能A（優先度：高）
- Phase 5: 機能B改善（優先度：中）
```

## 重要な開発原則

### 1. 設計ファースト開発
- **実装前に必ず設計**: 証跡ファイルでの設計検討が完了してから実装開始
- **既存システムの理解**: 新機能実装前に関連する既存コードを必ず調査
- **段階的アプローチ**: 複雑な機能は段階に分けて実装（Phase 1→2→3...）

### 2. 証跡による透明性確保
- **設計判断の記録**: なぜその技術選択をしたかの理由を明記
- **課題と解決策**: 発生した問題と対処法を詳細に記録
- **リアルタイム更新**: 作業進捗に合わせて証跡ファイルを継続更新

### 3. 品質重視の開発
- **テスト駆動開発**: テストファイル作成 → 実装 → 動作確認の順序
- **コード品質維持**: ESLint・TypeScriptエラーは実装中に随時解消
- **統合確認**: 個別実装完了後、必ず全体動作確認を実施

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

## 関連ファイル・ドキュメント

### 設計・仕様書
- `docs/development/`: 開発証跡ファイル保存場所
- `docs/redocly/openapi/`: OpenAPI仕様書
- `docs/architecture/database-design.md`: データベース設計ドキュメント
- `packages/schema/src/schema.ts`: APIスキーマ定義

### 設定ファイル
- `apps/frontend/eslint.config.js`: フロントエンドESLint設定
- `apps/backend/eslint.config.js`: バックエンドESLint設定  
- `tsconfig.json`: TypeScript設定

### 実装場所
- `apps/backend/src/route/`: バックエンドAPIルート実装
- `apps/frontend/src/`: フロントエンド実装
- `packages/database/src/queries/`: データベースクエリ実装

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