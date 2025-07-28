# データベース連携戦略

## 概要
PostgreSQLとNeo4jのハイブリッド構成における連携レベルと実装方針を定義する。

## 連携レベルの選択

### 採用: レベル1（最小限の連携）

#### 実装方針
```typescript
// PostgreSQL専用リポジトリ
class PostgreSQLScenarioRepository {
  async save(scenario: Scenario): Promise<void> {
    // PostgreSQLのみに保存
  }
}

// Neo4j専用リポジトリ  
class Neo4jScenarioRepository {
  async createStructure(scenario: Scenario): Promise<void> {
    // Neo4jのみに保存
  }
}

// アプリケーション層で個別呼び出し
class ScenarioService {
  async createScenario(data: ScenarioData): Promise<Scenario> {
    // 1. PostgreSQLに保存
    await this.pgRepo.save(data);
    
    // 2. Neo4jに保存（独立実行）
    await this.neo4jRepo.createStructure(data);
    
    return scenario;
  }
}
```

## 決定理由

### 1. MVP優先
- **目的**: 最小限の機能でシナリオ作成を実現
- **判断**: 複雑な整合性制御よりも基本機能の動作確認を優先
- **期間**: 短期開発サイクルに適合

### 2. 技術的制約
- **Cloudflare Workers**: 分散トランザクション（2PC）の制約
- **Neo4j**: ACID特性の制限
- **複雑性**: レベル2以上の連携は実装・保守コストが高い

### 3. ビジネス要件との適合
- **許容可能な不整合**: シナリオ作成時の一時的な不整合は許容範囲
- **データ復旧**: 手動での整合性チェック・修正で対応可能
- **可用性重視**: 一方のDBが停止しても部分的に動作継続

### 4. 将来的な拡張性
- **段階的改善**: 運用開始後にレベル2（エラーハンドリング）へ移行可能
- **マイクロサービス化**: 将来的なサービス分離に適合
- **技術選択の柔軟性**: 各DBの技術変更が独立して可能

## 他の選択肢と比較

### レベル2（アプリケーションレベル連携）
```typescript
async createScenario(data) {
  const pgResult = await this.pgRepo.create(data);
  try {
    await this.neo4jRepo.create(data);
    return pgResult;
  } catch (error) {
    await this.pgRepo.delete(pgResult.id); // ロールバック
    throw error;
  }
}
```
- **却下理由**: 実装複雑化、部分的な不整合リスクは同様
- **将来採用**: Phase 2以降で検討

### レベル3（分散トランザクション）
- **却下理由**: Cloudflare Workersでの実装困難
- **パフォーマンス**: 大幅な性能低下
- **複雑性**: 開発・運用コストが高い

### レベル4（イベント駆動）
- **却下理由**: MVPには過剰なアーキテクチャ
- **将来採用**: スケールアウト時に検討

## 実装ガイドライン

### リポジトリ設計
```typescript
// 各DBは完全に独立
interface PostgreSQLScenarioRepository {
  save(scenario: Scenario): Promise<void>;
  findById(id: string): Promise<Scenario | null>;
  delete(id: string): Promise<void>;
}

interface Neo4jScenarioRepository {
  createStructure(scenario: Scenario): Promise<void>;
  updateStructure(scenario: Scenario): Promise<void>;
  deleteStructure(id: string): Promise<void>;
}
```

### エラーハンドリング
```typescript
class ScenarioService {
  async createScenario(data: ScenarioData): Promise<Scenario> {
    try {
      // PostgreSQL保存
      const scenario = await this.pgRepo.save(data);
      
      // Neo4j保存（エラーはログのみ）
      try {
        await this.neo4jRepo.createStructure(scenario);
      } catch (neo4jError) {
        console.error('Neo4j sync failed:', neo4jError);
        // PostgreSQLのデータは残す（手動修正対象）
      }
      
      return scenario;
    } catch (pgError) {
      throw new Error('シナリオ作成に失敗しました');
    }
  }
}
```

### 整合性チェック
- **定期バッチ**: 日次でPostgreSQLとNeo4jの整合性をチェック
- **管理画面**: 不整合データの検出・修正機能
- **アラート**: 不整合検出時の通知機能

## 運用・監視

### ログ戦略
- PostgreSQL操作: 成功/失敗をログ出力
- Neo4j操作: 成功/失敗をログ出力
- 不整合検出: アラートレベルでログ出力

### メトリクス
- 各DB操作の成功率
- 不整合データの発生率
- データ修復の実行回数

## 将来の改善計画

### Phase 2: エラーハンドリング強化
- レベル2連携への移行
- 自動ロールバック機能
- より詳細なエラー分類

### Phase 3: イベント駆動アーキテクチャ
- 非同期データ同期
- イベントソーシング
- 最終的整合性の保証

## 意思決定の記録

- **決定日**: 2025-01-28
- **決定者**: 開発チーム
- **レビュー予定**: Phase 1完了時（機能実装完了後）
- **変更トリガー**: 不整合発生率が5%を超過した場合