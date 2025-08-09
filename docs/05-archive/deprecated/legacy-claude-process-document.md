# 旧開発プロセス文書（ルートCLAUDE.md）

> **アーカイブ理由**: ドキュメント構造統合により廃止・混乱回避
> 
> **移行日**: 2025-08-09
> **移行先**: `docs/03-development/process.md` (更新版)
> **関連問題**: `.claude/CLAUDE.md`との重複による混乱

## 📋 この文書について

これは プロジェクトルート `CLAUDE.md` の履歴記録です。Claude Code設定ファイル（`.claude/CLAUDE.md`）との混乱回避のため廃止されました。

### 廃止理由
1. **設定ファイルとの混同**: `.claude/CLAUDE.md`（Claude Code設定）と同名で混乱
2. **情報の陳腐化**: Sprint 001の古い情報・廃止パス参照が残存
3. **完全移行完了**: 内容は`docs/03-development/process.md`に統合済み
4. **新体系との整合性**: 統一ドキュメント構造に適合

## 🗂️ 旧ファイル内容（参考記録）

以下は削除時点でのルート`CLAUDE.md`の完全内容です：

---

# Odyssage - Claude開発支援ドキュメント

## プロジェクト概要

Odyssage は、TRPGセッション管理のためのWebアプリケーションです。
React + TypeScript (フロントエンド) と Hono.js + Cloudflare Workers (バックエンド) で構成されています。

## 現在のスプリント情報
- **現在のスプリント**: Sprint 001
- **証跡ファイル保存場所**: `docs/development/sprtints/sprint_001/`

## 開発手順

### Phase 1: 計画・設計段階

#### 1. 証跡ファイルの作成
新機能開発時は必ず以下の場所に証跡ファイルを作成：

```bash
# 証跡ファイル作成場所（現在のスプリント: Sprint 001）
docs/development/sprtints/sprint_001/[機能名]-implementation.md

# 例
docs/development/sprtints/sprint_001/scenario-graphdb-implementation.md
docs/development/sprtints/sprint_001/delete-scene-graphdb-implementation.md
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

#### 2. **真のテスト駆動開発（TDD）実践**

**重要：一気に実装せず、1つずつ段階的に進める**

```bash
# 新しい段階的開発フロー
1. 要件分析・小さな機能単位に分割
2. 失敗するテストを先に記述（Red）
3. テストを通す最小限実装（Green）
4. 機能テスト・動作確認
5. リファクタリング・品質向上（Refactor）
6. 次の小さな機能へ進む
```

**実装順序（TDDサイクル）**:
```bash
# 各小機能ごとに以下を繰り返す
1. Test First: 失敗するテスト作成
   - Unit Test作成 (*.test.ts)
   - テスト実行（Red - 失敗確認）
2. 最小限実装
   - テストを通す最小のコード
   - テスト実行（Green - 成功確認）
3. 動作確認・統合テスト
4. Refactor: コード改善
5. 次の機能へ進む
```

**段階的実装例**:
```bash
# 例：シーン機能の段階的開発
Phase 1: シーン1個作成のみ
- Test: 1個のシーン作成テスト
- Impl: 基本的なシーン作成機能
- Check: 1個作成の動作確認

Phase 2: シーン2個目作成
- Test: 連続作成テスト（UUID重複問題を事前検出）
- Impl: UUID生成ロジック改善
- Check: 連続作成の動作確認

Phase 3: シーン編集機能
- Test: 編集機能テスト
- Impl: 編集機能実装
- Check: 編集動作確認
```

#### 3. 実装時の原則
- **OpenAPI First**: バックエンドAPIは必ずOpenAPI仕様書を先に定義
- **テストファースト**: 実装前にテスト設計・作成
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
# バックエンド品質チェック
cd apps/backend
bun run test             # 統合テスト
bun run lint             # ESLint
bunx tsc --noEmit        # TypeScript型チェック

# フロントエンド品質チェック  
cd apps/frontend
bun run test             # 単体テスト
bun run lint             # ESLint
bun run build            # ビルド + 型チェック
```

**重要**: 
- バックエンド実装完了時点で必ずlint・型チェックを実行し、エラーを解消する
- OpenAPI仕様書とテストコード・スキーマ定義の整合性を確認する
- 矛盾が発見された場合は実装に合わせて仕様書を修正する

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

## ファイル作成時の重要事項

### 改行コード設定
**すべての新規ファイル作成時は必ずLF改行コードを使用すること**

- **理由**: ESLintの`linebreak-style`ルールがLFを要求
- **影響**: CRLF改行コードで作成すると大量のlintエラーが発生
- **対応**: ファイル作成時に改行コードをLFに指定する

```bash
# 正しい改行コード: LF (\n)
# 避けるべき改行コード: CRLF (\r\n)
```

**注意**: Windows環境でも必ずLF改行コードを使用。エディタ設定でLFを強制するか、ファイル作成後に変換すること。

### Windows環境での開発コマンド実行
**重要**: 以下の記法を必ず使用すること

#### パス記法
- **Windows環境でのbashコマンド実行時は `/d/projects/odyssage` 形式を使用**
  - ❌ `D:\projects\odyssage` (Windows形式はbashで使用不可)
  - ✅ `/d/projects/odyssage` (bash用Unix形式)

#### パッケージマネージャー
- **このプロジェクトでは bun を使用、npmは使わない**
  - ❌ `npm run lint`
  - ❌ `npm run build`
  - ✅ `bun run lint`
  - ✅ `bun run build`

#### 正しいコマンド実行例
```bash
# バックエンド
cd /d/projects/odyssage/apps/backend && bun run lint
cd /d/projects/odyssage/apps/backend && bunx tsc --noEmit

# フロントエンド  
cd /d/projects/odyssage/apps/frontend && bun run lint
cd /d/projects/odyssage/apps/frontend && bun run build
```

### OpenAPI仕様書との整合性確認手順
**重要**: APIテストを修正した場合は必ずOpenAPI仕様書との整合性を確認すること

#### 確認が必要なケース
- テストでAPIレスポンスの期待値を変更した場合
- エラーステータスコードの期待値を変更した場合
- APIパラメータのバリデーション結果を変更した場合

#### 確認手順
1. **OpenAPI仕様書確認**: `docs/redocly/openapi/paths/`の該当ファイルを確認
2. **実装との比較**: 実際のAPIレスポンスとOpenAPI定義の一致確認
3. **修正方針決定**:
   - 仕様書に実装を合わせる（バリデーション強化など）
   - 実装に仕様書を合わせる（仕様変更の場合）
4. **修正実施**: 決定した方針に基づいて修正
5. **再テスト実行**: 修正後の整合性確認

#### 修正例
```typescript
// 問題: テストで404期待だが、OpenAPIでは400定義
// 解決: スキーマにUUIDバリデーション追加
export const idSchema = v.object({
  id: v.pipe(v.string(), v.uuid()), // UUID検証追加
});
```

### Claude Codeの実行環境制約
**重要**: Claude CodeのBash実行環境には以下の制約があります

#### 確認された制約事項
- **実行環境固定**: MINGW64_NT環境で実行され、Git Bashとは微妙に異なる
- **シェル変更不可**: PowerShell、CMD、純粋なGit Bashへの変更はできない
- **環境設定変更不可**: PATH設定や環境変数の永続的変更はできない
- **TypeScriptコンパイラ問題**: `tsc -b`実行時に`/c:`パス解釈エラーが発生

#### 具体的な問題事例
```bash
# 問題のあるコマンド
"prebuild": "tsc -b"          # /c: /c: Is a directory エラー
"prebuild": "bunx tsc -b"     # 同様のエラー

# 動作するコマンド  
"build": "vite build"         # ✅ 正常動作
"tsc": "bunx tsc -b"         # ✅ 個別実行では動作
```

#### 回避策と運用方針
1. **ビルドスクリプト**: TypeScriptコンパイルを除去し、viteの内蔵処理に依存
2. **型チェック**: 個別スクリプト(`bun run tsc`)として分離実行
3. **開発時型チェック**: IDE（VS Code等）での型チェックを活用
4. **CI/CD**: 本番環境では適切なGit Bash環境での実行を前提

#### 推奨package.json設定
```json
{
  "scripts": {
    "tsc": "bunx tsc -b",        // 個別型チェック用
    "build": "vite build",       // ビルド（型チェック除外）
    "lint": "eslint .",          // ESLintでの型チェック補完
  }
}
```

### テスト記述における重要な指針

#### テスト項目の事前整理原則
テスト実装前に必ず `test.todo` でテスト項目を洗い出し、ユーザーに確認を得ること：

**理由**:
- **モック設計の複雑化回避**: SWRやAPIクライアントのモック実装は複雑になりがち
- **テスト目的の明確化**: 「SWRを呼び出す」ではなく「APIからデータを取得する」など、ビジネス観点でのテスト記述
- **実装効率の向上**: 事前にテスト範囲を確定することで、不要な実装を回避

**手順**:
1. 対象機能の責務を分析
2. `test.todo` で具体的なテスト項目を列挙
3. テスト項目をビジネス観点で記述（技術的詳細ではなく機能的観点）
4. ユーザー確認後に実装開始

**例**: Hook テストの場合
```typescript
// ❌ 技術的詳細に焦点
test.todo('SWRを適切なパラメータで呼び出す');

// ✅ ビジネス機能に焦点  
test.todo('scenarioIdが存在する場合、適切なキーでデータ取得を開始する');
test.todo('正常な場合：APIからシーンデータを取得し、JSONとして返す');
```

この原則により、テスト実装の方向性を事前に合意し、効率的な開発を実現する。

## 重要な開発原則

### 1. 真のテスト駆動開発（TDD）
- **テストファースト**: 実装前に必ずテスト作成
- **Red-Green-Refactorサイクル**: 失敗→成功→改善の繰り返し
- **小刻みな開発**: 1つの小さな機能ずつ完結させる
- **段階的検証**: 各ステップで動作確認

### 2. 設計ファースト開発
- **実装前に必ず設計**: 証跡ファイルでの設計検討が完了してから実装開始
- **既存システムの理解**: 新機能実装前に関連する既存コードを必ず調査
- **段階的アプローチ**: 複雑な機能は段階に分けて実装（Phase 1→2→3...）

### 3. 証跡による透明性確保
- **設計判断の記録**: なぜその技術選択をしたかの理由を明記
- **課題と解決策**: 発生した問題と対処法を詳細に記録
- **リアルタイム更新**: 作業進捗に合わせて証跡ファイルを継続更新
- **ユーザーフィードバックの反映**: 開発プロセス中のフィードバックと対応判断を記録

### 4. 品質重視の開発
- **テスト駆動開発**: テストファイル作成 → 最小実装 → 動作確認の順序
- **コード品質維持**: ESLint・TypeScriptエラーは実装中に随時解消
- **統合確認**: 個別実装完了後、必ず全体動作確認を実施

## 開発時の品質保証手順

実装完了後は必ず以下の手順で品質チェックを実行し、全てのエラーを解消してから作業完了とすること。

### 機能開発完了チェックリスト

**必須テスト実行項目**
新機能開発完了時に以下を必ず実行・確認すること：

1. **バックエンドテスト**
   - [ ] 統合テスト実行・全テスト通過確認
   - [ ] lint・型チェック実行

2. **フロントエンドテスト**  
   - [ ] Hook/コンポーネントの作成
   - [ ] lint・型チェック実行
   - [ ] ビルドエラー確認

3. **E2Eテスト（BDD）**
   - [ ] **BDDテスト実行・全シナリオ通過確認**
   - [ ] フロントエンド実装後の統合動作確認
   - [ ] 実際のユーザーシナリオでの動作保証

4. **完了判定**
   - [ ] 上記3項目の全て完了
   - [ ] 証跡記録・設計判断記録
   - [ ] 依存関係・制約事項の明確化

**作業フロー**
1. 設計・仕様策定
2. バックエンド実装・テスト
3. **BDDテスト作成時に依存関係を明確化** ← UI実装が必要かAPI単体で十分かを判断
4. フロントエンド実装  
5. **BDDテスト実行・統合確認** ← 重要：省略禁止、依存関係未実装時は代替手段を実施
6. 証跡記録・完了

**段階的実装時の注意事項**
- **Hook/API単体実装時**: BDDテストがUI依存の場合、API単体テストまたは制約付きBDDテストで代替
- **依存関係の明記**: 各実装フェーズで必要な前提条件を証跡に記録
- **完了基準の調整**: 依存関係による制約がある場合、明確な完了条件と次段階への引き継ぎ事項を記録

**品質保証手順見落とし防止策**
実装完了時の必須確認項目:
1. **TODO漏れチェック**: 証跡ファイルの実装計画と実際の完了状況を照合
2. **依存関係確認**: BDDテストに必要なUI/機能が実装済みかチェック  
3. **指針ファイル更新**: 発見した問題と対策をCLAUDE.mdに必ず反映
4. **完了基準明確化**: 「実装完了」と「動作確認完了」を明確に分離

根本原因と対策:
- **原因**: 作業完了の錯覚（実装＝テスト済みの誤認）
- **対策**: 各フェーズの完了定義を明文化、チェックリスト必須実行
- **教訓**: 環境問題対応中でも品質保証手順の省略は禁止

### 1. 基本品質チェック

```bash
# フロントエンド
cd apps/frontend
bun run lint      # ESLintチェック
bun run build     # ビルドエラーチェック + TypeScript型チェック

# バックエンド  
cd apps/backend
bun run lint      # ESLintチェック
bunx tsc --noEmit # TypeScript型チェック
```

### 2. エラー修正の基本方針

#### ESLintエラー対応
- **改行コードエラー**: `bun run lint --fix`で自動修正（CRLF → LF変換）
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
bun run lint
# → エラー0件で正常完了

bun run build  
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
bun run local:all    # 全サービス起動
bun run dev:frontend # フロントエンド開発サーバー
bun run dev:backend  # バックエンド開発サーバー
```

---

## 🎯 移行記録・学習価値

### 成功した要素
- **包括的プロセス記述**: TDD実践からデプロイまでの包括的手順
- **実用的ガイドライン**: 実際の開発環境制約への対応
- **品質保証重視**: lint・型チェック・テスト実行の必須化
- **透明性確保**: 技術判断・設計決定の文書化徹底

### 改善された点
- **最新化**: Sprint 003情報への更新（`docs/03-development/process.md`）
- **パス統一**: 新ディレクトリ構造への対応
- **構造整理**: 新体系との整合性確保
- **混乱回避**: Claude Code設定ファイルとの分離

### 技術的価値
- **TDD実践ガイド**: 段階的開発・テストファーストの具体的手順
- **品質保証手順**: ESLint・TypeScript・ビルドエラー対応の体系化
- **Windows環境対応**: Claude Code環境制約の詳細記録
- **OpenAPI連携**: 仕様書ファーストの開発フロー確立

## 🔗 関連リソース

### 新しいドキュメント構造
- [[../../03-development/process]] - 更新された開発プロセス
- [[../../03-development/README]] - 開発ガイド統合ハブ
- [[../../03-development/sprints/README]] - スプリント運用ルール

### 設定・アーキテクチャ
- [[../../02-architecture/api-design]] - OpenAPI設計指針
- [[../../02-architecture/database-design]] - データベース設計
- [[../../.claude/CLAUDE]] - Claude Code設定（活用継続）

### 移行・管理
- [[../../00-index]] - ドキュメント全体インデックス
- [[../../DOCUMENTATION_POLICY]] - ドキュメント管理方針

---

## 📊 統計情報

### アーカイブ実績
- **原本ファイルサイズ**: 約15,000文字
- **移行完了日**: 2025-08-09
- **関連移行**: Sprint 003 Development統合作業の一環

### 影響範囲
- **混乱解消**: `.claude/CLAUDE.md`との重複解決
- **情報統一**: 開発プロセス情報の一元化
- **歴史保存**: 開発プロセス進化の記録として保持

#archive #deprecated #process #development #claude #migration #sprint003