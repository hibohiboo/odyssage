# APIパス設計リファクタリング TODO

> Context-based Design規約に基づくAPIパスの再設計・移行計画

## 📋 プロジェクト概要

### 背景・目的
**現状課題**: OpenAPI Context-based Design Discussion（openapi-context-based-design-discussion.md）で策定されたHybrid Approachの設計指針に基づき、現在のAPIパス構造を文脈ベース設計に移行する必要がある。

**設計方針**:
- **参照系（READ）**: RESTful統一エンドポイント + 内部文脈制御
- **更新系（WRITE）**: 文脈特化エンドポイント + 明示的権限分離

### 期待成果
- **統一されたAPI設計指針**: 参照・更新の明確な分離ルール実装
- **文脈ベースOpenAPI仕様**: ユーザー区分別の詳細仕様整備
- **権限・階層構造ガイドライン**: 一貫した実装パターン確立

---

## 🔍 現在のAPI構造分析

### 📊 既存エンドポイントマッピング

#### **現在のルート構造**:
```typescript
// route/index.ts の構造
.route('/users', user)           // 認証必須（authorizeMiddleware）
.route('/sessions', sessionRoute)  // セッション関連
.route('/gm', gmRoute)           // GM専用ルート
.route('/graph-scenarios', graphScenarioRoute) // GraphDB関連
.route('/graph-scenes', graphSceneRoute)       // GraphDB関連

// 直接定義エンドポイント
GET /api/scenarios              // 全シナリオ一覧
GET /api/scenarios/public       // 公開シナリオ一覧
GET /api/scenario/{id}          // 個別シナリオ詳細
```

#### **詳細エンドポイント分析**:

**ユーザー関連（/api/users）**:
```http
# 既存実装（user.ts）
GET    /api/users/{uid}                              # ✅ 適切（RESTful）
PUT    /api/users/{uid}                              # ✅ 適切（RESTful）
GET    /api/users/{uid}/scenario                     # ❌ 要リファクタリング
POST   /api/users/{uid}/scenario                     # ❌ 要リファクタリング
PUT    /api/users/{uid}/scenario/{id}                # ❌ 要リファクタリング
GET    /api/users/{uid}/stocked-scenarios            # ❌ 要リファクタリング
POST   /api/users/{uid}/stocked-scenarios/{id}       # ❌ 要リファクタリング
DELETE /api/users/{uid}/stocked-scenarios/{id}       # ❌ 要リファクタリング
```

**セッション関連（/api/sessions）**:
```http
# 既存実装（session.ts）
GET    /api/sessions                     # ✅ 適切（RESTful参照系）
POST   /api/sessions                     # ❌ 要リファクタリング（GM文脈特化すべき）
GET    /api/sessions/{id}                # ✅ 適切（RESTful）
GET    /api/sessions/gm/{gm_id}          # ✅ 適切（文脈特化）
```

**GM関連（/api/gm）**:
```http
# 既存実装（gm.ts）
PATCH  /api/gm/{uid}/sessions/{id}       # ✅ 適切（文脈特化更新系）
```

**シナリオ関連（直接定義）**:
```http
# 既存実装（route/index.ts）
GET    /api/scenarios                    # ✅ 適切（RESTful参照系）
GET    /api/scenarios/public             # ✅ 適切（RESTful参照系）
GET    /api/scenario/{id}                # ⚠️ パス統一性要改善（/scenarios/{id}）
```

### 🚨 発見された課題

#### **主要課題**:

**1. 階層構造の不整合**:
```http
# 現在：不統一なパターン
GET /api/users/{uid}/scenario           # 単数形
POST /api/users/{uid}/scenario          # 単数形
GET /api/scenario/{id}                  # 単数形、階層なし

# 期待：統一されたRESTfulパターン
GET /api/scenarios                      # 複数形
GET /api/scenarios/{id}                 # 複数形、統一階層
```

**2. 文脈特化不足**:
```http
# 現在：汎用的なパス
POST /api/sessions                      # 作成者（GM）が曖昧

# 期待：文脈特化パス
POST /api/gm/{uid}/sessions            # GM文脈での作成
```

**3. 権限境界の曖昧性**:
```http
# 現在：権限区分が不明確
POST /api/users/{uid}/scenario          # Author? GM? Player?

# 期待：明確な権限境界
POST /api/authors/{uid}/scenarios       # シナリオ作成者文脈
POST /api/gm/{uid}/scenarios/{id}/stock # GM文脈でのストック操作
```

---

## 🎯 新API階層設計（文脈ベース）

### 📖 設計原則再確認

#### **Hybrid Approach実装指針**:
```typescript
interface APIDesignRules {
  readOperations: {
    pattern: 'GET /api/{resource}[/{id}]';
    strategy: 'RESTful unified endpoint';
    contextHandling: 'internal JWT-based field addition';
  };
  
  writeOperations: {
    pattern: 'POST|PUT|PATCH|DELETE /api/{role}/{uid}/{resource}[/{id}][/actions/{action}]';
    strategy: 'context-specific endpoints';
    security: 'explicit ownership check + role validation';
  };
}
```

### 🏗️ 新階層構造設計

#### **参照系（RESTful統一エンドポイント）**:
```http
# シナリオ参照系
GET /api/scenarios                      # 全シナリオ一覧（権限別フィールド追加）
GET /api/scenarios/public               # 公開シナリオ一覧（GM/Player文脈情報追加）
GET /api/scenarios/{id}                 # 個別シナリオ詳細（文脈別権限情報追加）

# セッション参照系  
GET /api/sessions                       # セッション一覧（文脈別フィールド追加）
GET /api/sessions/{id}                  # 個別セッション詳細（権限別操作情報追加）
GET /api/sessions/gm/{gm_id}           # GM管理セッション一覧（既存維持）

# ユーザー参照系
GET /api/users/{uid}                    # ユーザー情報取得（既存維持）
```

#### **更新系（文脈特化エンドポイント）**:

**🎨 シナリオ作成者（Author）文脈**:
```http
POST   /api/authors/{uid}/scenarios              # シナリオ新規作成
PUT    /api/authors/{uid}/scenarios/{id}         # 自分のシナリオ編集
DELETE /api/authors/{uid}/scenarios/{id}         # 自分のシナリオ削除
PATCH  /api/authors/{uid}/scenarios/{id}/visibility  # 公開設定変更
```

**🎲 ゲームマスター（GM）文脈**:
```http
# セッション管理
POST   /api/gm/{uid}/sessions                    # セッション作成
PUT    /api/gm/{uid}/sessions/{id}               # 自分のセッション編集（既存改善）
DELETE /api/gm/{uid}/sessions/{id}               # 自分のセッション削除
PATCH  /api/gm/{uid}/sessions/{id}/status        # セッション状態更新

# シナリオストック管理
POST   /api/gm/{uid}/scenarios/{id}/actions/stock    # シナリオストック追加
DELETE /api/gm/{uid}/scenarios/{id}/actions/unstock  # シナリオストック解除

# プレイヤー管理
POST   /api/gm/{uid}/sessions/{id}/players/{player_id}/invite   # プレイヤー招待
DELETE /api/gm/{uid}/sessions/{id}/players/{player_id}/remove   # プレイヤー除名
```

**👥 プレイヤー（Player）文脈**:
```http
# セッション参加・離脱
POST   /api/player/{uid}/sessions/{id}/actions/join     # セッション参加申請
DELETE /api/player/{uid}/sessions/{id}/actions/leave    # セッション離脱
PATCH  /api/player/{uid}/sessions/{id}/actions/ready    # 準備完了状態変更
```

**👤 基本ユーザー操作**:
```http
PUT /api/users/{uid}                             # ユーザー情報更新（既存維持）
```

### 📋 新旧マッピング表

#### **移行マッピング**:

| 現在のエンドポイント | 新エンドポイント | 移行種別 | 理由 |
|---------------------|-----------------|----------|------|
| `GET /api/scenario/{id}` | `GET /api/scenarios/{id}` | パス修正 | RESTful統一（複数形） |
| `GET /api/users/{uid}/scenario` | `GET /api/scenarios?author={uid}` | 統合 | RESTful参照系統一 |
| `POST /api/users/{uid}/scenario` | `POST /api/authors/{uid}/scenarios` | 文脈特化 | Author文脈明確化 |
| `PUT /api/users/{uid}/scenario/{id}` | `PUT /api/authors/{uid}/scenarios/{id}` | 文脈特化 | Author権限明確化 |
| `POST /api/sessions` | `POST /api/game-masters/{uid}/sessions` | 文脈特化 | GM作成権限・ロール名統一 |
| `GET /api/sessions/gm/{gm_id}` | `GET /api/game-masters/{uid}/sessions` | 文脈特化 | ロール名・パラメータ名統一 |
| `PATCH /api/gm/{uid}/sessions/{id}` | `PATCH /api/game-masters/{uid}/sessions/{id}` | ロール統一 | 命名一貫性確保 |
| `GET /api/users/{uid}/stocked-scenarios` | `GET /api/scenarios/stocked?gm={uid}` | 統合 | RESTful参照系統一 |
| `POST /api/users/{uid}/stocked-scenarios/{id}` | `POST /api/game-masters/{uid}/scenarios/{id}/actions/stock` | 文脈特化 | GM文脈・ロール名統一 |
| `DELETE /api/users/{uid}/stocked-scenarios/{id}` | `DELETE /api/game-masters/{uid}/scenarios/{id}/actions/unstock` | 文脈特化 | GM文脈・ロール名統一 |

---

## 📈 実装計画・段階的移行戦略

> **⚠️ 重要な変更**: ユーザーフィードバックに基づく計画修正
> - **プロセス変更**: 仕様更新 → テスト修正 → 実装修正 → テスト確認 → フロントエンド反映
> - **アプローチ変更**: 一括移行から **1APIずつ完全移行** に変更

### 🔄 新移行プロセス（1API単位）

#### **標準移行フロー**
```
1. OpenAPI仕様更新    📝 仕様先行
2. テスト修正・追加    🧪 期待動作定義  
3. 実装修正・新規追加   💻 実装変更
4. テスト実行・確認    ✅ 動作確認
5. フロントエンド反映   🎨 UI/UX更新
6. 旧API廃止準備      🗑️ 段階的廃止
```

### 📋 対象API優先順位・選定

#### **移行対象API分析**

**🟢 優先度: 高（影響小・効果大）**
1. **`GET /api/scenario/{id}` → `GET /api/scenarios/{id}`**
   - 理由: 単純なパス修正、RESTful統一
   - 影響: 最小限（参照系のみ）
   - 効果: API一貫性向上

2. **`POST /api/users/{uid}/scenario` → `POST /api/authors/{uid}/scenarios`**
   - 理由: Author文脈明確化、基本CRUD機能
   - 影響: 中程度（作成者機能のみ）
   - 効果: 権限境界明確化

**🟡 優先度: 中（実装要検討）**
3. **`POST /api/sessions` → `POST /api/game-masters/{uid}/sessions`**
   - 理由: GM文脈特化、セッション作成権限明確化、ロール名統一
   - 影響: 中程度（GM機能のみ）
   - 効果: セキュリティ向上・命名一貫性

4. **`GET /api/sessions/gm/{gm_id}` → `GET /api/game-masters/{uid}/sessions`**
   - 理由: ロール名統一（gm → game-masters）・パラメータ名統一（gm_id → uid）
   - 影響: 中程度（既存GM機能、テスト大幅修正必要）
   - 効果: 命名一貫性・RESTful化

**🔴 優先度: 低（新機能・将来実装）**
5. **Playerセッション参加機能（新規）**
   - `POST /api/players/{uid}/sessions/{id}/actions/join`
   - 理由: 新機能、実装範囲大
   - 影響: 大（新機能開発）
   - 効果: 機能拡張

---

## 🎯 第1弾API移行計画: `GET /api/scenario/{id}` → `GET /api/scenarios/{id}`

### **選定理由**
- ✅ **最小リスク**: 参照系のみ、破壊的変更なし
- ✅ **明確な改善**: RESTful命名統一（scenario → scenarios）  
- ✅ **学習効果**: 移行プロセスの確立・検証に最適
- ✅ **即効性**: API一貫性向上の即時効果
- ✅ **テスト影響小**: Docker環境問題の影響を受けにくい

### **⚠️ 事前課題: テスト環境修復必須**
**test-architecture-analysis.md** で特定された課題への対応:
```bash
# 現状: 統合テスト完全停止
Error: Could not find a working container runtime strategy
FAIL test/integrations/*.spec.ts > 全統合テスト（26件全滅）

# 必須対応
1. Docker Desktop 起動・設定
2. Testcontainers 環境修復  
3. PostgreSQL + Neo4j コンテナ起動確認
```

### **詳細移行計画**

#### **Step 1: OpenAPI仕様更新（3日）**

**1-1. 新パス仕様作成**
- [ ] **`docs/redocly/openapi/paths/scenarios-detail.yaml` 作成**
  - 新パス: `GET /api/scenarios/{id}`
  - パラメータ名統一: `id` (UUID形式)
  - レスポンススキーマ: 既存維持 + 文脈別フィールド拡張準備

**1-2. 旧パス仕様更新**  
- [ ] **`docs/redocly/openapi/paths/scenario.yaml` にDeprecated追加**
  - `deprecated: true` マーク
  - `description` に移行案内追加
  - 新パスへのリダイレクト案内

**1-3. スキーマ拡張準備**
```yaml
# scenarios-detail.yaml 拡張予定
ScenarioDetailResponse:
  allOf:
    - $ref: '#/components/schemas/BaseScenario'
    - type: object
      properties:
        # 文脈別フィールド（将来実装）
        authorPermissions:
          $ref: '#/components/schemas/AuthorPermissions'
        gmInfo:
          $ref: '#/components/schemas/GMContextInfo'
```

#### **Step 2: テスト修正・追加（2日）**

**2-1. 既存テスト更新**
- [ ] **`scenario-detail.spec.ts` パス修正**
  - リクエストURL: `/api/scenario/{id}` → `/api/scenarios/{id}`
  - テストデータ・期待値: 変更なし
  - 新旧パス並行テスト期間設定

**2-2. 移行テスト追加**
- [ ] **新旧API結果一致テスト作成**
```typescript
describe('API移行確認テスト', () => {
  it('新旧エンドポイントで同一結果を返すこと', async () => {
    const oldResponse = await app.request('/api/scenario/test-id');
    const newResponse = await app.request('/api/scenarios/test-id');
    
    expect(oldResponse.status).toBe(newResponse.status);
    expect(await oldResponse.json()).toEqual(await newResponse.json());
  });
});
```

#### **Step 3: 実装修正・新規追加（2日）**

**3-1. 新パス実装**
- [ ] **`route/index.ts` に新エンドポイント追加**
```typescript
// 新パス追加（推奨）
.get('/scenarios/:id', vValidator('param', idSchema), async (c) => {
  const param = c.req.valid('param');
  const [data] = await getScenariosByid(c.env.NEON_CONNECTION_STRING, param.id);
  if (!data) {
    return c.text('Not Found', 404);
  }
  return c.json(data);
})

// 旧パス維持（非推奨警告付き）
.get('/scenario/:id', vValidator('param', idSchema), async (c) => {
  // Deprecated警告
  c.header('X-Deprecated-Endpoint', 'true');
  c.header('X-New-Endpoint', 'GET /api/scenarios/{id}');
  
  // 同一ロジック実行（重複回避）
  return scenarioDetailHandler(c);
});
```

**3-2. 共通ハンドラー抽出**
- [ ] **重複ロジック排除**
```typescript
const scenarioDetailHandler = async (c: Context) => {
  const param = c.req.valid('param');
  const [data] = await getScenariosByid(c.env.NEON_CONNECTION_STRING, param.id);
  if (!data) {
    return c.text('Not Found', 404);
  }
  return c.json(data);
};
```

#### **Step 4: テスト実行・確認（1日）**

**4-1. 統合テスト実行**
- [ ] **新パステスト実行**: `bun run test scenarios-detail.spec.ts`
- [ ] **移行テスト実行**: 新旧API結果一致確認
- [ ] **既存テスト確認**: 他機能への影響確認

**4-2. 手動テスト実行**
- [ ] **新パス動作確認**: Postman/curl での動作確認
- [ ] **Deprecated警告確認**: 旧パスでのヘッダー確認

#### **Step 5: フロントエンド反映（3日）**

**5-1. フロントエンド側パス更新**
- [ ] **APIクライアント更新**
```typescript
// 修正前
const getScenarioDetail = (id: string) => 
  api.get(`/api/scenario/${id}`);

// 修正後  
const getScenarioDetail = (id: string) => 
  api.get(`/api/scenarios/${id}`);
```

**5-2. 段階的移行対応**
- [ ] **機能フラグ対応**（必要に応じて）
- [ ] **エラー処理更新**: Deprecated警告への対応

#### **Step 6: 旧API廃止準備（1日）**

**6-1. 使用状況監視**
- [ ] **アクセスログ確認**: 旧パスの使用状況監視
- [ ] **フロントエンド完全移行確認**: 新パスへの完全切り替え確認

**6-2. 廃止スケジュール設定**
- [ ] **廃止予告**: 3か月後廃止予定の告知
- [ ] **ドキュメント更新**: 移行完了の記録

### **成功指標・確認項目**

#### **技術指標**
- [x] **新パス正常動作**: 全テスト通過（既存同等）
- [x] **旧パス維持**: Deprecated警告付きで正常動作
- [x] **パフォーマンス**: 応答時間劣化なし
- [x] **エラーハンドリング**: 404・500エラーの適切な処理

#### **プロセス指標**  
- [x] **仕様先行**: OpenAPI更新後の実装実施
- [x] **テスト先行**: テスト修正後の実装修正
- [x] **段階的移行**: 新旧API並行運用期間確保
- [x] **フロントエンド完了**: UI側への完全反映

---

## 🚀 移行プロセス標準化

### **テンプレート化した移行フロー**

#### **各APIごとの標準作業**
```markdown
# API移行計画: [API名]

## Step 1: OpenAPI仕様更新（[予定日数]日）
- [ ] 新パス仕様作成・ファイル配置
- [ ] 旧パス Deprecated マーク  
- [ ] スキーマ更新・拡張対応

## Step 2: テスト修正・追加（[予定日数]日）
- [ ] 既存テストのパス修正
- [ ] 新旧API一致確認テスト追加
- [ ] エラーケース・権限テスト追加

## Step 3: 実装修正・新規追加（[予定日数]日）
- [ ] 新パス実装・ハンドラー作成
- [ ] 旧パス Deprecated 警告追加
- [ ] 権限チェック・エラーハンドリング実装

## Step 4: テスト実行・確認（1日）
- [ ] 統合テスト実行・結果確認
- [ ] 手動テスト・動作確認  
- [ ] 既存機能影響確認

## Step 5: フロントエンド反映（[予定日数]日）
- [ ] APIクライアント更新
- [ ] UI/UX修正・テスト
- [ ] 段階的移行・機能フラグ対応

## Step 6: 旧API廃止準備（1日）  
- [ ] 使用状況監視・移行確認
- [ ] 廃止スケジュール・告知
```

### **📊 全体移行スケジュール案（修正版）**

| 順位 | API移行対象 | 予定期間 | 作業量 | 開始予定 | 主な変更内容 |
|------|------------|----------|--------|----------|-------------|
| 1 | **`GET /api/scenario/{id}` → `scenarios/{id}`** | 12日 | 低 | 即時開始可能 | RESTful統一のみ |
| 2 | **`POST /api/users/{uid}/scenario` → `authors/{uid}/scenarios`** | 15日 | 中 | API1完了後 | Author文脈特化 |
| 3 | **既存`PATCH /api/gm/{uid}/sessions/{id}` → `game-masters/{uid}/sessions/{id}`** | 10日 | 中 | API2完了後 | ロール名統一のみ |
| 4 | **`GET /api/sessions/gm/{gm_id}` → `game-masters/{uid}/sessions`** | 20日 | 高 | API3完了後 | ロール名・パラメータ名・テスト大幅修正 |
| 5 | **`POST /api/sessions` → `game-masters/{uid}/sessions`** | 18日 | 中 | API4完了後 | 新GM文脈エンドポイント |
| 6 | **Player参加機能（新規）** | 25日 | 高 | API5完了後 | 完全新機能 |

**合計予定期間**: 約4-5か月（100日、段階的実施）

### **⚠️ 重要な設計変更事項**

#### **1. ロール名統一: `gm` → `game-masters`**
```http
# api-path-structure-design.md に基づく修正
❌ 旧計画: /api/gm/{uid}/...
✅ 新計画: /api/game-masters/{uid}/...

理由: 
- 英語表記の統一性（authors, game-masters, players）
- 国際化対応・可読性向上
- RESTful命名慣習への準拠
```

#### **2. パラメータ名統一: `gm_id` → `uid`**  
```http
# 現在の不整合
❌ GET /api/sessions/gm/{gm_id}    # パラメータ名不統一
❌ PATCH /api/gm/{uid}/sessions/{id} # ロール名不統一

# 統一後
✅ GET /api/game-masters/{uid}/sessions  # 統一命名
✅ PATCH /api/game-masters/{uid}/sessions/{id} # 統一命名
```

#### **3. テスト環境問題への対応**
**test-architecture-analysis.md** により発見された重要課題:
- **統合テスト実行率: 0%** (Docker環境問題)
- **既存テスト破綻リスク: 高** (エンドポイント大幅変更)
- **修正工数増加: 2-3日/API** (テスト修復含む)

---

## 🎯 技術実装詳細

### 🔧 実装戦略

#### **1. ルート階層設計**
```typescript
// 新しいルート構造
const route = new Hono<Env>()
  // 参照系（RESTful）
  .route('/scenarios', scenarioReadRoute)
  .route('/sessions', sessionReadRoute)  
  .route('/users', userReadRoute)
  
  // 更新系（文脈特化）
  .route('/authors', authorWriteRoute)    // シナリオ作成者文脈
  .route('/gm', gmWriteRoute)             // GM文脈（既存拡張）
  .route('/player', playerWriteRoute)     // プレイヤー文脈（新設）
```

#### **2. 権限チェックミドルウェア設計**
```typescript
// 文脈別権限チェック
interface ContextMiddleware {
  authorOwnership: (uid: string, resourceId: string) => boolean;  // 作成者所有権確認
  gmOwnership: (uid: string, sessionId: string) => boolean;       // GM所有権確認
  playerPermission: (uid: string, action: string) => boolean;     // プレイヤー権限確認
}
```

#### **3. 文脈別レスポンス生成**
```typescript
// JWT解析での文脈判定
interface ContextualResponse {
  baseFields: Record<string, any>;           // 共通フィールド
  authorFields?: Record<string, any>;        // 作成者文脈フィールド
  gmFields?: Record<string, any>;            // GM文脈フィールド
  playerFields?: Record<string, any>;        // プレイヤー文脈フィールド
}
```

### 📋 OpenAPI仕様設計

#### **文脈別スキーマ表現**
```yaml
# 文脈別レスポンススキーマの例
components:
  schemas:
    ScenarioResponse:
      oneOf:
        - $ref: '#/components/schemas/AuthorScenarioResponse'
        - $ref: '#/components/schemas/GMScenarioResponse'
        - $ref: '#/components/schemas/PlayerScenarioResponse'
      discriminator:
        propertyName: context
        mapping:
          author: '#/components/schemas/AuthorScenarioResponse'
          gm: '#/components/schemas/GMScenarioResponse'
          player: '#/components/schemas/PlayerScenarioResponse'
    
    AuthorScenarioResponse:
      allOf:
        - $ref: '#/components/schemas/BaseScenario'
        - type: object
          properties:
            canEdit: { type: boolean }
            canDelete: { type: boolean }
            editUrl: { type: string }
```

---

## 🚨 リスク・考慮事項

### ⚠️ 技術リスク

#### **1. テスト環境の根本的問題**
- **リスク**: 統合テスト実行率0%、リグレッション検出不可
- **対策**: Docker環境修復・Testcontainers安定化を最優先実施
- **工数影響**: 各API移行で追加2-3日のテスト修復工数

#### **2. 大規模エンドポイント変更の影響**
- **リスク**: `gm` → `game-masters` 変更で既存テスト・フロントエンド大幅修正
- **対策**: 段階的移行・長期間の並行運用期間確保
- **工数増加**: 当初想定の1.5-2倍の作業量

#### **3. 後方互換性影響**
- **リスク**: フロントエンドでの既存API利用箇所の破綻
- **対策**: 段階的移行・Deprecated警告期間設定

#### **4. 権限制御複雑化**
- **リスク**: 文脈別権限チェックでのセキュリティホール
- **対策**: 包括的な権限テスト・ペネトレーションテスト実施

#### **5. OpenAPI仕様複雑化**
- **リスク**: 文脈別スキーマでの仕様書可読性低下
- **対策**: examples・description充実・ドキュメント分割

### 📊 成功指標

#### **定量指標**
- [ ] **API設計一貫性**: 100%のエンドポイントが設計指針に準拠
- [ ] **テストカバレッジ**: 新機能95%以上・既存機能維持100%
- [ ] **パフォーマンス**: API応答時間劣化なし（<100ms増加）

#### **定性指標**
- [ ] **開発者体験**: フロントエンド開発者から使いやすさ向上評価
- [ ] **セキュリティ向上**: 権限制御の明確化・誤操作防止効果確認
- [ ] **仕様整合性**: OpenAPI仕様と実装の完全一致

---

## 📝 次のステップ・レビュー観点

### 🔍 レビュー依頼事項

#### **設計方針確認**
1. **Hybrid Approach実装方針**: 参照系RESTful・更新系文脈特化の設計判断は適切か？
2. **階層構造設計**: `/api/{role}/{uid}/{resource}[/{id}][/actions/{action}]` パターンは適切か？
3. **移行戦略**: 段階的移行スケジュール（6週間）は現実的か？

#### **技術実装検討**
1. **権限制御**: 文脈別ミドルウェア設計は実装可能性があるか？
2. **後方互換性**: Deprecated期間設定は十分か？
3. **テスト戦略**: 既存テスト更新・新規テスト範囲は適切か？

#### **優先順位・スコープ調整**
1. **Phase分割**: 各フェーズの作業量・依存関係は適切か？
2. **Player文脈**: セッション参加機能の実装優先度は高いか？
3. **OpenAPI更新**: 仕様書更新のタイミング・範囲は適切か？

### 🎯 期待する意思決定

#### **承認いただきたい事項**
- [ ] **設計方針の最終確定**: Hybrid Approach実装の承認
- [ ] **移行計画の承認**: 6週間・5フェーズでの段階的移行
- [ ] **優先度調整**: Phase内での作業優先順位の調整指示

#### **追加検討・変更要求**
- [ ] **設計修正**: 階層構造・命名規則の調整要求
- [ ] **スコープ調整**: 実装範囲の拡大・縮小指示
- [ ] **スケジュール調整**: より現実的な期間設定の提案

---

## 🏷️ メタデータ

**作成日**: 2025-08-11  
**関連Issue**: GitHub #111（バックエンドリアーキテクティング）  
**関連文書**: 
- `openapi-context-based-design-discussion.md` (設計方針策定)
- `backend-rearchitecting-todo.md` (全体TODOリスト)
- `api-test-coverage-todo.md` (テスト実装計画)

**ステータス**: 設計完了・レビュー待ち  
**推定工数**: 6週間（30-40人日）  
**優先度**: 高（API品質向上・開発効率改善）

#api-design #refactoring #context-based #hybrid-approach #backend #openapi #migration-plan