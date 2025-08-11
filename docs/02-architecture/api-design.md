# API設計指針

## 概要

OdyssageのREST API設計原則、OpenAPIファーストアプローチ、バリデーション戦略について記録します。

## 🎯 設計原則

### フルスタックアーキテクチャ配慮（2025-08-11改訂）
- **責務分担の明確化**: フロントエンド（複雑ビジネスロジック）vs バックエンド（データ永続化）
- **補完的業務としての設計**: バックエンドAPIは「データ更新の補完業務」として軽量設計
- **Edge Computing最適化**: Cloudflare Workersの特性を活かした効率的実装

#### **DDD適用境界の明確化**
```typescript
// ✅ フロントエンド: 複雑なドメインロジック
interface TRPGDomainService {
  createScenarioWorkflow(input: CreateScenarioInput): ScenarioWorkflowResult;
  handleOptimisticConflict(local: Change[], server: State): Resolution;
  validateBusinessRules(scenario: Scenario): ValidationResult;
}

// ✅ バックエンド: 最小限のドメインルール + 永続化
interface APIScenarioService {
  validateForPersistence(dto: ScenarioDTO): ValidationResult;
  persistScenario(dto: ScenarioDTO): Promise<PersistResult>;
  checkUniqueness(title: string): Promise<boolean>;
}
```

### OpenAPI First アプローチ
- **仕様書駆動開発**: 実装前にOpenAPI定義必須
- **契約による設計**: フロントエンド・バックエンド間の明確な契約
- **自動ドキュメント生成**: 仕様書からドキュメント自動生成

### RESTful設計
- **HTTPメソッド**: GET/POST/PUT/DELETE の適切な使い分け
- **ステータスコード**: 意味のある HTTP ステータスコード活用
- **リソース指向**: URL設計におけるリソース中心の考え方

### データバリデーション
- **Valibot活用**: TypeScript型安全なリクエスト/レスポンス検証
- **入力検証**: 全てのユーザー入力の厳格なバリデーション
- **エラーハンドリング**: 一貫したエラーレスポンス形式

## 📋 API設計パターン

### エンドポイント命名規則
```
/api/{resource}           # リソースコレクション
/api/{resource}/{id}      # 単一リソース
/api/{resource}/{id}/{sub-resource}  # サブリソース
```

### レスポンス形式
```typescript
// 成功レスポンス
interface SuccessResponse<T> {
  success: true;
  data: T;
}

// エラーレスポンス
interface ErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    details?: any;
  };
}
```

### ステータスコード使用法
- **200**: 成功（GET/PUT）
- **201**: 作成成功（POST）
- **204**: 成功・レスポンス本文なし（DELETE）
- **400**: バリデーションエラー
- **401**: 認証エラー
- **403**: 認可エラー
- **404**: リソース未発見
- **500**: サーバー内部エラー

## 🔐 認証・認可

### Firebase Authentication連携
- **JWTトークン**: Firebase JWTの検証・利用
- **ユーザー情報**: トークンからのユーザーID抽出
- **権限チェック**: リソースアクセス権限の確認

### セキュリティヘッダー
```typescript
// 必須ヘッダー
Authorization: Bearer <firebase-jwt-token>
Content-Type: application/json

// CORS対応
Access-Control-Allow-Origin: <allowed-origins>
Access-Control-Allow-Methods: GET,POST,PUT,DELETE,OPTIONS
Access-Control-Allow-Headers: Authorization,Content-Type
```

## 📊 データモデル設計

### UUID活用とドメインオブジェクト
```typescript
// 全てのリソースIDはUUID
interface BaseResource {
  id: string; // UUID v4
  createdAt: string; // ISO 8601
  updatedAt: string; // ISO 8601
}

// ドメインオブジェクト（値オブジェクトを含む）
interface ScenarioDomain extends BaseResource {
  title: ScenarioTitle;           // 値オブジェクト
  overview: ScenarioOverview;     // 値オブジェクト
  authorId: AuthorId;             // 識別子
  visibility: Visibility;         // 列挙型
  status: ScenarioStatus;         // 状態オブジェクト
  
  // ドメインメソッド（フロントエンドで実装）
  canBePublished(): boolean;
  validateForPublication(): ValidationResult;
  generatePublicUrl(): string;
}
```

### ハイブリッドDB対応とドメイン境界
```typescript
// PostgreSQL向け（永続化用DTO）
interface ScenarioMetadataDTO extends BaseResource {
  title: string;
  overview: string;
  authorId: string;
  visibility: 'public' | 'private';
  
  // バックエンドでの最小限バリデーション
  static validateForPersistence(dto: ScenarioMetadataDTO): ValidationResult;
}

// Neo4j向け（関係性・構造データ）
interface ScenarioStructureDTO {
  id: string; // PostgreSQLと共通UUID
  title: string; // 冗長データ（検索性能向上）
  overview: string; // 冗長データ
  authorId: string;
  // scenes, events, messages の関係性
  
  // グラフDB特有のドメインルール
  static validateGraphStructure(dto: ScenarioStructureDTO): ValidationResult;
}
```

## 🚀 パフォーマンス最適化

### キャッシュ戦略
```
GET /api/scenarios        # Cache-Control: public, max-age=300
GET /api/scenarios/{id}   # Cache-Control: public, max-age=600
POST /api/scenarios       # キャッシュ無効化
```

### ページネーション
```typescript
interface PaginationQuery {
  page?: number;    // デフォルト: 1
  limit?: number;   // デフォルト: 20, 最大: 100
  sort?: string;    // ソート条件
  order?: 'asc' | 'desc'; // ソート順序
}

interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}
```

### レスポンス最適化
- **必要なフィールドのみ**: 不要なデータの除外
- **N+1問題回避**: リレーションデータの効率的取得
- **圧縮**: gzip圧縮の活用

## 📝 OpenAPI仕様書管理

### ファイル構成
```
docs/redocly/openapi/
├── api.yaml              # メインAPI定義
├── paths/               # エンドポイント定義
│   ├── scenarios.yaml   # シナリオ関連
│   ├── sessions.yaml    # セッション関連
│   └── users.yaml       # ユーザー関連
└── components/
    └── schemas/         # 共通スキーマ定義
        ├── response.yaml
        ├── session.yaml
        └── scenario.yaml
```

### バージョン管理
- **セマンティックバージョニング**: v1.0.0形式
- **下位互換性**: 破壊的変更の慎重な管理
- **非推奨マーク**: 将来削除予定APIの明示

## 🔍 テスト戦略（フルスタックDDD対応）

### フルスタック境界でのテスト戦略
```typescript
// 🎯 フロントエンド: ドメインロジック重点テスト
describe('ScenarioWorkflowService', () => {
  it('should validate business rules correctly', () => {
    const scenario = new ScenarioAggregate(input);
    const result = scenario.validateForPublication();
    expect(result.isValid).toBe(true);
  });
  
  it('should handle optimistic conflict resolution', () => {
    const resolver = new OptimisticConflictResolver();
    const resolution = resolver.resolve(localChanges, serverState);
    expect(resolution.strategy).toBe('merge-with-priority');
  });
});

// ⚡ バックエンド: 軽量統合テスト重点
describe('Scenario API Integration', () => {
  it('should persist scenario data correctly', async () => {
    const response = await api.post('/api/scenarios', validDTO);
    expect(response.status).toBe(201);
    
    const persisted = await db.findById(response.body.id);
    expect(persisted.title).toBe(validDTO.title);
  });
});
```

### API テストレベル（DDD適用境界考慮）
1. **統合テスト（重点）**: データベース連携・API動作確認
2. **E2Eテスト（重点）**: フロントエンド複雑ロジックの完全検証  
3. **単体テスト（最小限）**: バックエンド境界値・エラーケース

### テスト記述統一化（2025-08-11更新）
```typescript
// ✅ 統一済み構文: it() 使用
// 正常系テスト
it('should return scenario list on GET /api/scenarios success', async () => {
  // テストロジック
});

// 異常系テスト  
it('should return 400 on POST /api/scenarios validation error', async () => {
  // テストロジック
});

// 認証テスト
it('should return 401 on unauthorized access', async () => {
  // テストロジック
});
```

**重要**: 全テストで `it()` を使用、`test()` は使用禁止

## 📈 監視・ログ

### API メトリクス
- **レスポンス時間**: エンドポイント別の平均応答時間
- **エラー率**: HTTPステータスコード別の発生頻度
- **スループット**: 1秒あたりのリクエスト数

### 構造化ログ
```typescript
interface APILog {
  timestamp: string;
  method: string;
  path: string;
  statusCode: number;
  responseTime: number;
  userId?: string;
  error?: string;
}
```

## 🔄 今後の拡張計画

### Phase 2: 高度な機能
- **GraphQL検討**: より柔軟なデータ取得API
- **WebSocket**: リアルタイム通信機能
- **バッチAPI**: 複数操作の一括実行

### Phase 3: エンタープライズ機能
- **API Rate Limiting**: 利用制限機能
- **API Gateway**: 統一エントリーポイント
- **マイクロサービス**: ドメイン別API分割

---

## 📖 関連リソース

### 設計書
- [[database-design]] - ハイブリッドDB設計との連携
- [[environment-variables]] - API設定・環境変数管理
- [[overview]] - システム全体アーキテクチャ

### 実装ガイド
- [[../03-development/process]] - API開発プロセス・TDD実践
- [[../03-development/testing-strategy]] - API テスト戦略詳細

### 運用・管理
- [[../04-deployment/production]] - API本番運用・監視
- OpenAPI仕様書: `docs/redocly/openapi/`

#architecture #api #design #openapi #rest