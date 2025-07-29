# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Global

常に日本語で返答してください
t_wadaのテスト駆動の手法で開発してください。
改行コードは必ずLF（Line Feed）を使用してください。
次のステップに進む前に、必ずlintエラーを修正してからにしてください。

## ステップ完了前の必須チェック手順

各開発ステップを完了する前に、以下の手順を必ず実行してください：

### 1. Lintチェックの実行
```bash
# 該当パッケージでlintチェックを実行
cd packages/[パッケージ名]
bun run lint

# エラーがある場合は修正
bun run lint --fix  # 自動修正可能なエラーを修正
```

### 2. テスト実行（該当する場合）
```bash
# 該当パッケージでテスト実行
cd packages/[パッケージ名]
bun run test

# 特定のテストファイルのみ実行する場合
bun run test [テストファイル名]
```

### 3. ビルドチェック（該当する場合）
```bash
# TypeScriptのコンパイルチェック
cd packages/[パッケージ名]
bun run build  # または tsc --noEmit
```

### 4. エラー対応方針
- **Lintエラー**: 必ず0個にしてから次のステップに進む
- **テスト失敗**: 基本機能に影響する場合は修正、軽微なものは次ステップで対応
- **ビルドエラー**: 必ず修正してから次のステップに進む

### 5. 完了確認
全てのチェックが通過したら、TODOリストで該当タスクを「completed」に更新する

## Lint設定・ルール

### class-methods-use-this の設計方針
以下のケースではclass-methods-use-thisエラーを無視し、インスタンスメソッドとして維持します：

1. **ドメインサービスのメソッド**: DDD設計に従い、将来的な依存性注入やリポジトリ連携を考慮
2. **将来の拡張性を考慮したメソッド**: 現在は`this`を使用しないが、アーキテクチャ一貫性のため
3. **インターフェース実装が予想されるメソッド**: テスタビリティとモックの容易さのため

### 修正完了済みlintエラー
- **no-underscore-dangle**: プライベートフィールドをアンダースコア記法から`#`記法に変更
- **max-classes-per-file**: 1ファイル1クラスの原則を適用、必要に応じてファイル分割
- **sonarjs/pseudo-random**: UUIDライブラリを使用した安全なID生成に変更
- **any型の排除**: 適切な型定義による型安全性の向上
- **CRLF行末問題**: 全ファイルをLF形式に統一

テスト駆動開発の定義は以下です。

1. 網羅したいテストシナリオのリスト（テストリスト）を書く
2. テストリストの中から「ひとつだけ」選び出し、実際に、具体的で、実行可能なテストコードに翻訳し、テストが失敗することを確認する
3. プロダクトコードを変更し、いま書いたテスト（と、それまでに書いたすべてのテスト）を成功させる（その過程で気づいたことはテストリストに追加する）
4. 必要に応じてリファクタリングを行い、実装の設計を改善する
5. テストリストが空になるまでステップ2に戻って繰り返す

## ファイル管理の使い分け

### TEST_LIST.md vs todos.md

プロジェクトでは2つの異なる管理ファイルを使用します：

#### `.claude/TEST_LIST*.md` - テストリスト管理
**重要**: テスト駆動開発を行う際は、必ず `.claude/TEST_LIST*.md` ファイルでテストリストを管理してください。

**用途**: テスト駆動開発（TDD）の際のテストケース管理
**対象**: 具体的な機能単位のテスト項目
**粒度**: 関数・メソッド・コンポーネント レベル
**期間**: 短期（1つの機能実装完了まで）

**ファイル命名規則**:
- `.claude/TEST_LIST.md` - メインのテストリスト
- `.claude/TEST_LIST_[機能名].md` - 機能別のテストリスト
  - 例: `TEST_LIST_NEO4J.md`, `TEST_LIST_API.md`, `TEST_LIST_FRONTEND.md`

```markdown
例：
- [ ] ユーザーが空の名前でシナリオを作成しようとするとエラーになる
- [ ] 正常なデータでシナリオが作成できる
- [ ] 作成されたシナリオのIDが返される
```

**管理方針**:
1. **機能別分割**: 大きな機能は専用のTEST_LISTファイルを作成
2. **既存テスト保持**: 完了済みテストは削除せず履歴として保持
3. **状態管理**: 未実装/実装中/完了の状態を明確に管理
4. **追加発見**: 実装過程で気づいた新しいテストケースを追加
5. **完了確認**: 全てのテストが完了するまで継続

#### `.claude/todos.md` - プロジェクト全体のTODO管理
**用途**: プロジェクト全体の開発タスク管理
**対象**: 機能実装・設計・インフラ・ドキュメント等
**粒度**: 機能・モジュール・パッケージ レベル
**期間**: 長期（プロジェクト全体を通して）

```markdown
例：
- [ ] シナリオ作成用Neo4jノード・リレーションシップ実装
- [ ] APIエンドポイントの設計と実装
- [ ] フロントエンドコンポーネントの設計と実装
```

**管理方針**:
1. プロジェクト全体の進捗を優先度別に管理
2. 完了済み・進行中・待機中で状態分類
3. 設計決定事項や技術的負債も記録
4. セッション間の継続性を保つための参考情報

### 使い分けの判断基準

- **テスト項目を書く場合** → `TEST_LIST.md`
- **開発タスクを書く場合** → `todos.md`
- **迷った場合**: 「1つのPRで完了するか？」で判断
  - Yes → TEST_LIST.md
  - No → todos.md

## ファイル作成・編集ルール

### 改行コード

- ファイルの終端は必ずLF（\n）にする
- 既に終端がLFの場合は追加しない（重複を避ける）
- これはすべてのテキストファイル（.md、.js、.ts、.py等）に適用する

### フォーマット

- 空白だけの行は改行文字のみにする（空白文字を含めない）
- 文章の末尾の空白は削除する
- 行末に不要な空白文字を残さない

## Project Overview

Odyssage is an asynchronous, gamebook-style TRPG (tabletop RPG) platform built as a Bun monorepo. The project enables users to create scenarios, manage game sessions, and engage in role-playing experiences through a web interface.

## Development Commands

### Setup

```bash
npm run init          # Configure git hooks and setup
bun install          # Install dependencies
```

### Local Infrastructure

```bash
npm run local:all     # Start all services (PostgreSQL, Neo4j, Firebase)
npm run local:rdb     # PostgreSQL database only
npm run local:graphdb # Neo4j graph database only
npm run local:firebase # Firebase emulator only
```

### Development

```bash
npm run dev           # Run all apps concurrently
npm run dev:backend   # Backend only (Cloudflare Workers)
npm run dev:frontend  # Frontend only (React + Vite)
npm run dev:ui        # UI package only (Storybook)
```

### Build & Test

```bash
npm run build         # Build all packages via Turbo
npm run test          # Run all tests via Vitest workspace
npm run ncu           # Update dependencies across workspace
```

### Package-Specific Commands

```bash
# Backend testing
cd apps/backend && bun run test:integration

# Frontend testing
cd apps/frontend && bun run test

# UI components
cd packages/ui && bun run storybook
```

## Architecture Overview

### Monorepo Structure

- **apps/backend**: Cloudflare Workers API using Hono.js
- **apps/frontend**: React SPA with Vite and Tailwind CSS v4
- **packages/**: Shared libraries for database, UI, schema, and utilities

### Database Architecture

**Dual Database Setup:**

- **PostgreSQL (Primary)**: User management, scenarios, sessions via Drizzle ORM
- **Neo4j (Graph)**: Complex relationships and scenario flows

### Key Technologies

- **Frontend**: React 19, TypeScript, Redux Toolkit, SWR, React Router v7
- **Backend**: Cloudflare Workers, Hono.js, Firebase Auth, JWT
- **Databases**: PostgreSQL (Neon), Neo4j, Drizzle ORM
- **Testing**: Vitest, Playwright, Cucumber BDD, MSW
- **Build**: Turbo, Bun, Vite with SWC

## Development Guidelines

### Code Context Requirements

This project uses GitHub Copilot with specific context annotations. When working on files, include the appropriate context comment at the top:

```typescript
// @copilot-context frontend    # For React components, hooks, UI
// @copilot-context backend     # For API routes, database access
// @copilot-context testing     # For test files (REQUIRED)
// @copilot-context naming      # For schema/model definitions
```

### Frontend (Feature-Sliced Design)

- **Structure**: `src/entities/`, `src/features/`, `src/shared/`, `src/pages/`
- **State Management**: Redux Toolkit for global state, SWR for server state
- **Styling**: Tailwind CSS v4 with component-scoped styles
- **Components**: Shared UI library in `packages/ui` with Storybook

### Backend (API-First)

- **OpenAPI**: All API changes must update `docs/redocly/openapi/api.yaml`
- **Validation**: Use Valibot schemas in `packages/schema`
- **Authentication**: Firebase Auth with JWT token verification
- **Database**: Drizzle schema in `packages/database`

### テスト実行コマンド

各パッケージでのテスト実行は以下の通り：

```bash
# graph-database パッケージ
cd packages/graph-database
bun run test                    # 全テスト実行
bun run test choice.test.ts     # 特定ファイル実行

# domain パッケージ  
cd packages/domain
bun run test                    # 全テスト実行
bun run test scenario.test.ts   # 特定ファイル実行

# その他のパッケージでも同様
cd packages/[パッケージ名]
bun run test [ファイル名]
```

**重要**: `bun test` ではなく `bun run test` を使用すること

### Testing Strategy

- **Unit Tests**: Vitest across all packages
- **Integration Tests**: Backend with Testcontainers for database testing
- **E2E Tests**: Playwright + Cucumber for user workflows
- **Component Tests**: Storybook + Testing Library for UI components

## Key Patterns

### Database Access

```typescript
// PostgreSQL queries via Drizzle
const scenarios = await db
  .select()
  .from(scenarioTable)
  .where(eq(scenarioTable.userId, userId));

// Neo4j queries for relationships
const relationships = await session.run(
  'MATCH (s:Scenario)-[r:CONNECTS]->(n:Node) RETURN s, r, n',
);
```

### API Development

- Routes in `apps/backend/src/route/`
- Middleware for auth in `apps/backend/src/middleware/`
- OpenAPI specification drives development
- CORS configured for multiple environments

### Frontend Data Flow

- SWR for API data fetching with caching
- Redux Toolkit for application state
- Custom hooks for component logic separation
- MSW for testing API interactions

## Environment Configuration

### Backend Environment Variables

- `JWT_PUBLIC_KEY`: Firebase project public key
- `CORS_ORIGINS`: Allowed frontend origins
- Database connection strings for PostgreSQL and Neo4j

### Local Development

Requires Docker for database services. Firebase emulator provides local authentication.

## Documentation

- **API Documentation**: Generated from OpenAPI spec via Redoc
- **Component Library**: Storybook at `packages/ui`
- **Database Schema**: SchemaSpy documentation
- **Developer Docs**: Astro-based site with Japanese language support

## Important Notes

- **Language**: Project supports Japanese (primary) and English
- **Package Manager**: Use Bun exclusively (not npm/yarn)
- **Git Hooks**: Configured via `.githooks/` directory
- **Deployment**: Cloudflare Workers (backend) and Cloudflare Pages (frontend)
- **Testing**: Use Testcontainers for integration tests requiring real databases
