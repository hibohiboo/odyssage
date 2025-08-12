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

---

## 🔧 API移行・リファクタリング実践知見（2025-08-12追加）

### RESTful命名統一プロジェクトからの学習

#### **第1弾移行実績**: `GET /api/scenario/{id} → GET /api/scenarios/{id}`

**実施内容**:
- **目的**: RESTful設計原則への統一（単数形→複数形リソース名）
- **期間**: 実質2日（設計・実装・テスト・削除完了）
- **削除効果**: 約200行のコード負債削除、テスト実行時間43%短縮

#### **移行戦略パターン**

**段階的移行 vs 迅速削除の判断基準**:
```
外部影響度 × 実装複雑度 = 移行戦略

高影響・高複雑度: 段階的移行（監視期間3-6ヶ月）
高影響・低複雑度: 事前告知 + スケジュール削除（1-3ヶ月）  
低影響・高複雑度: 代替確認 + 迅速削除（1-2週間）
低影響・低複雑度: 即座削除（1-3日） ← 内部プロジェクト推奨
```

**内部プロジェクトでの最適化戦略**:
- ✅ **フロントエンド未使用確認**: 全ファイル検索で実利用状況確認
- ✅ **移行テスト**: 新旧API同一動作を保証後、即座に削除対象化
- ✅ **記憶が新しいうちに削除**: コンテキスト維持による作業効率化
- ✅ **技術的負債圧縮**: 保守負担の迅速な軽減

#### **実装パターン**

**新旧API並行実装（一時的）**:
```typescript
// 新API（推奨）- RESTful統一
.get('/scenarios/:id', vValidator('param', idSchema), async (c) => {
  const param = c.req.valid('param');
  const [data] = await getScenariosByid(c.env.NEON_CONNECTION_STRING, param.id);
  if (!data) return c.text('Not Found', 404);
  return c.json(data);
})

// 旧API（非推奨）- 後方互換性維持
.get('/scenario/:id', vValidator('param', idSchema), async (c) => {
  // Deprecated警告ヘッダー
  c.header('X-Deprecated-Endpoint', 'true');
  c.header('X-New-Endpoint', 'GET /api/scenarios/{id}');
  c.header('X-Deprecated-Until', '2025-11-01');
  
  // 同一ロジック実行（レスポンス完全一致保証）
  return [同一の実装];
});
```

**移行完了後（推奨）**:
```typescript
// 新APIのみ維持
.get('/scenarios/:id', vValidator('param', idSchema), async (c) => {
  const param = c.req.valid('param');
  const [data] = await getScenariosByid(c.env.NEON_CONNECTION_STRING, param.id);
  if (!data) return c.text('Not Found', 404);
  return c.json(data);
});
```

#### **OpenAPI仕様管理**

**移行前OpenAPI構成**:
```yaml
# api.yaml
paths:
  /api/scenarios/{id}:
    $ref: './paths/scenarios-detail.yaml'  # 新API仕様
  /api/scenario/{id}:
    $ref: './paths/scenario.yaml'          # 旧API仕様（廃止警告付き）
```

**移行完了後**:
```yaml
# api.yaml
paths:
  /api/scenarios/{id}:
    $ref: './paths/scenarios-detail.yaml'  # 新API仕様のみ
```

#### **移行テスト戦略**

**Phase 1: 移行互換性テスト（一時的）**:
```typescript
describe('API移行互換性テスト', () => {
  it('新旧エンドポイントが完全に同一結果を返すこと', async () => {
    const oldResponse = await getScenarioLegacy(testId);
    const newResponse = await getScenario(testId);
    
    expect(oldResponse.status).toBe(newResponse.status);
    expect(await oldResponse.json()).toEqual(await newResponse.json());
  });
  
  it('Deprecated警告ヘッダーが付与されること', async () => {
    const response = await getScenarioLegacy(testId);
    expect(response.headers.get('X-Deprecated-Endpoint')).toBe('true');
  });
});
```

**Phase 2: 統一テスト（完了形）**:
```typescript
describe('GET /api/scenarios/{id}', () => {
  it('存在するシナリオを正しく取得できる', async () => {
    const res = await getScenario(testScenario.id);
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual(expectedData);
  });
  
  it('存在しないシナリオで404エラー', async () => {
    const res = await getScenario(nonExistentId);
    expect(res.status).toBe(404);
  });
});
```

#### **効果測定**

**技術的負債削除効果**:
- **コード量削減**: バックエンド実装・OpenAPI仕様・テストで約200行削除
- **テスト効率化**: 9→5テストで実行時間43%短縮（2290ms → 以前3207ms比較）
- **認知負荷軽減**: 開発者が考慮すべきAPIエンドポイント統一
- **保守性向上**: 重複コード・設定による保守負荷解消

**学習事項**:
- **段階的移行は内部プロジェクトでは過剰**: 外部利用者なしなら即座削除が効率的
- **移行テストの役割**: 動作保証確認後は速やかに削除対象とする
- **「記憶が新しいうちに削除」**: コンテキスト維持・作業効率・品質向上を実現

#### **次弾移行計画への活用**

**適用予定**:
- `POST /api/users/{uid}/scenario → POST /api/authors/{uid}/scenarios`
- `PATCH /api/gm/{uid}/sessions/{id} → PATCH /api/game-masters/{uid}/sessions/{id}`

**効率化要素**:
- 今回のテンプレート活用による50%工数削減見込み
- 迅速削除による技術的負債圧縮の継続
- OpenAPI First開発の確立による仕様・実装一貫性向上
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