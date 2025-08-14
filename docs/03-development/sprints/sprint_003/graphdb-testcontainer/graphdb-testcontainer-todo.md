# GraphDB Testcontainer導入 TODO

## 概要
issue #115: Neo4jのTestcontainerを適用し、テスト環境の自動化と独立性を向上させる。

## 実装計画

### フェーズ1: 依存関係とセットアップ
- [x] `@testcontainers/neo4j`をbackendパッケージに追加
- [x] `@testcontainers/neo4j`をgraph-databaseパッケージに追加
- [ ] Testcontainers Neo4jの動作確認

### フェーズ2: バックエンド統合テスト対応 (方針更新)
- [ ] 既存`apps/backend/test/integrations/test-utils.ts`からNeo4j関連設定を削除
- [ ] Neo4j専用ヘルパー`apps/backend/test/integrations/neo4j-test-utils.ts`を新規作成
- [ ] Neo4j Testcontainer専用のsetup関数を実装
- [ ] バックエンド統合テストでNeo4j Testcontainerを使用

### フェーズ3: graph-databaseパッケージ対応
- [ ] `packages/graph-database/test-utils/`にTestcontainer用ヘルパーを作成
- [ ] 既存のローカルNeo4j依存テストをTestcontainer対応に修正
- [ ] TestCleanupHelperとの統合確認
- [ ] graph-databaseパッケージテスト実行確認

### フェーズ4: BDDテスト対応
- [ ] `packages/bdd-e2e-test/e2e/utils/neo4j-helper.ts`をTestcontainer対応に修正
- [ ] BDDテストでNeo4j Testcontainerを使用
- [ ] シナリオテスト実行確認

### フェーズ5: 品質保証とドキュメント更新
- [ ] 全テスト実行・通過確認
  - [ ] バックエンド統合テスト
  - [ ] graph-databaseテスト
  - [ ] BDDテスト
- [ ] lint・型チェック実行
- [ ] パフォーマンステスト（起動時間など）
- [ ] READMEとドキュメントの更新

## 技術仕様

### 対象パッケージ
- `apps/backend`: 統合テスト環境
- `packages/graph-database`: ユニットテスト環境
- `packages/bdd-e2e-test`: E2Eテスト環境

### 参考実装
- 既存のPostgreSQL Testcontainer実装を参考
- [Testcontainers Neo4j Module](https://node.testcontainers.org/modules/neo4j/)

### 設定要件
- Neo4j 5.x系の使用
- テスト並列実行対応
- 自動クリーンアップ機能
- 既存のTestCleanupHelperとの互換性

## 制約・注意事項
- 既存のローカルNeo4j環境は維持（開発用）
- テスト実行時間の影響を最小限に
- Bunパッケージマネージャーを使用（npm禁止）
- 改行コードはLFで統一

## 完了基準
- [ ] 全てのNeo4j関連テストがTestcontainerで実行可能
- [ ] ローカルNeo4j環境への依存を削除
- [ ] CI/CD環境でも動作確認
- [ ] テスト実行時間が大幅に増加しない
- [ ] 全品質保証手順の完了

## リスク・対策
- **リスク**: Testcontainer起動時間によるテスト実行時間増加
- **対策**: コンテナ再利用やキャッシュ戦略の検討

- **リスク**: 既存テストの動作不良
- **対策**: 段階的移行と十分なテスト実行

- **リスク**: メモリ・リソース使用量増加
- **対策**: 適切なコンテナ設定とクリーンアップ