# @odyssage/graph-database

## 役割
Neo4jグラフデータベースとの接続・操作を担当するパッケージです。複雑な関係性やネットワーク構造の処理を行います。

## 責務
- **Neo4j接続**: グラフデータベースへの接続管理
- **グラフクエリ**: Cypherクエリの実行
- **関係性管理**: シナリオフローの複雑な関係性処理

## 構成
```
src/
├── driver.ts          # Neo4j接続ドライバー
└── driver.test.ts     # ドライバーテスト
```

## 技術スタック
- **Neo4j**: グラフデータベース
- **neo4j-driver**: Neo4j公式JavaScriptドライバー
- **Vitest**: テストフレームワーク

## テスト実行

### 基本コマンド
```bash
# 全テスト実行
bun run test

# 特定ファイルのテスト実行
bun run test [ファイル名]

# 例：Choice ノードのテスト実行
bun run test choice.test.ts

# ウォッチモード（ファイル変更時に自動実行）
bun run test --watch
```

### 注意事項
- **間違ったコマンド**: `bun test [ファイル名]` ← これは使わない
- **正しいコマンド**: `bun run test [ファイル名]` ← package.jsonのscriptを使用

### 前提条件
テスト実行前にNeo4jデータベースを起動してください：
```bash
# プロジェクトルートから
npm run local:graphdb
```

## テスト作成ルール

### 必須：TestCleanupHelperの使用
**重要**: Neo4jを使用するすべてのテストファイルでTestCleanupHelperを必ず使用してください。

```typescript
import { TestCleanupHelper } from '../test-utils/test-helpers';

describe('テスト名', () => {
  let session: Session;
  let cleanup: TestCleanupHelper;

  beforeEach(async () => {
    session = driver.session();
    cleanup = new TestCleanupHelper(session);
    
    // テスト開始前にクリーンアップを実行
    await cleanup.cleanup();
  });

  afterEach(async () => {
    await cleanup.cleanup();
    await session.close();
  });

  it('テストケース', async () => {
    // IDセットを生成（自動的にクリーンアップ対象に登録される）
    const testIds = cleanup.generateTestSpecificIdSet('test-name');
    
    // または単一IDを生成する場合
    const singleId = cleanup.generateSuiteSpecificId('unique-id');
    cleanup.addTestId(singleId);
  });
});
```

### TestCleanupHelper使用の理由
1. **並列実行対応**: 各テストが独立したID範囲を使用
2. **データ競合防止**: テスト間でのデータ干渉を防止
3. **自動クリーンアップ**: 手動でのクリーンアップコードが不要
4. **一貫性**: すべてのテストで統一されたID管理

### 禁止事項
- **固定IDの使用**: `'test-scenario-1'`のような固定IDは使用禁止
- **手動クリーンアップ**: `MATCH (n) DETACH DELETE n`のような手動クリーンアップは禁止
- **TestCleanupHelperなしのテスト**: Neo4jを使用するテストではTestCleanupHelperを必ず使用

## 用途
- **シナリオフロー**: Scene間の複雑な分岐・合流関係
- **選択肢ナビゲーション**: プレイヤーの選択による経路追跡
- **関係性分析**: シナリオ構造の分析・可視化

## 設計原則
- **接続管理**: 適切なコネクションプールの管理
- **型安全性**: TypeScriptでのクエリ結果型定義
- **エラーハンドリング**: ネットワークエラーの適切な処理

## 依存関係
- **データベース**: Neo4j
- **使用される場所**: apps/backend（複雑なクエリ処理時）

## 注意事項
- PostgreSQLで表現困難な複雑な関係性に特化
- 基本的なCRUD操作はPostgreSQLを使用
- パフォーマンスを考慮したクエリ設計