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
| `POST /api/sessions` | `POST /api/gm/{uid}/sessions` | 文脈特化 | GM作成権限明確化 |
| `GET /api/users/{uid}/stocked-scenarios` | `GET /api/scenarios/stocked?gm={uid}` | 統合 | RESTful参照系統一 |
| `POST /api/users/{uid}/stocked-scenarios/{id}` | `POST /api/gm/{uid}/scenarios/{id}/actions/stock` | 文脈特化 | GM文脈・アクション明確化 |
| `DELETE /api/users/{uid}/stocked-scenarios/{id}` | `DELETE /api/gm/{uid}/scenarios/{id}/actions/unstock` | 文脈特化 | GM文脈・アクション明確化 |

---

## 📈 実装計画・段階的移行戦略

### Phase 1: 基盤整備・設計確定（Week 1）

#### **🔍 現状分析完了**
- [x] **既存API構造の詳細分析**
  - [x] エンドポイント一覧・マッピング作成
  - [x] 権限制御実装状況確認
  - [x] OpenAPI仕様との乖離特定

#### **📋 設計策定**
- [ ] **新階層構造の詳細設計**
  - [ ] 文脈別エンドポイントパス確定
  - [ ] 権限チェックロジック設計
  - [ ] エラーハンドリング文脈対応設計
  
- [ ] **移行計画・優先順位決定**
  - [ ] 影響範囲分析（フロントエンド・テスト）
  - [ ] 段階的移行スケジュール策定
  - [ ] 後方互換性保持戦略

### Phase 2: 参照系API統一（Week 2）

#### **🔄 RESTfulエンドポイント統一**
- [ ] **シナリオ参照系改善**
  - [ ] `GET /api/scenario/{id}` → `GET /api/scenarios/{id}` パス修正
  - [ ] 文脈別フィールド追加ロジック実装
  - [ ] JWTベースの権限情報付加機能
  
- [ ] **セッション参照系強化**
  - [ ] 既存 `GET /api/sessions` の文脈別レスポンス対応
  - [ ] Player/GM文脈での情報差別化実装

#### **📝 OpenAPI仕様更新**
- [ ] **参照系スキーマ更新**
  - [ ] 文脈別レスポンススキーマ定義
  - [ ] oneOf・examples活用した文脈表現
  - [ ] 権限フィールド仕様化

### Phase 3: 更新系API文脈特化（Week 3-4）

#### **🎨 Author文脈エンドポイント実装**
- [ ] **新エンドポイント実装**
  - [ ] `POST /api/authors/{uid}/scenarios` 作成
  - [ ] `PUT /api/authors/{uid}/scenarios/{id}` 編集
  - [ ] 所有者チェック・権限制御実装
  
- [ ] **既存エンドポイント移行**
  - [ ] 現在の `/api/users/{uid}/scenario` 系を文脈特化
  - [ ] 後方互換性維持（Deprecated警告付き）

#### **🎲 GM文脈エンドポイント拡張**
- [ ] **セッション管理強化**
  - [ ] `POST /api/gm/{uid}/sessions` GM専用作成
  - [ ] `DELETE /api/gm/{uid}/sessions/{id}` 削除機能追加
  
- [ ] **シナリオストック機能移行**
  - [ ] `POST /api/gm/{uid}/scenarios/{id}/actions/stock` 
  - [ ] `DELETE /api/gm/{uid}/scenarios/{id}/actions/unstock`
  - [ ] アクションベースURL設計実装

#### **👥 Player文脈エンドポイント新設**
- [ ] **セッション参加機能実装**
  - [ ] `POST /api/player/{uid}/sessions/{id}/actions/join`
  - [ ] `DELETE /api/player/{uid}/sessions/{id}/actions/leave`
  - [ ] Player権限・参加制限チェック

### Phase 4: テスト・品質確保（Week 5）

#### **🧪 既存テスト更新**
- [ ] **統合テストの移行対応**
  - [ ] 新エンドポイントパスでのテスト更新
  - [ ] 文脈別レスポンス検証テスト追加
  - [ ] 権限チェックテストの拡充

#### **📊 新機能テスト作成**
- [ ] **Player文脈APIテスト**
  - [ ] セッション参加・離脱機能テスト
  - [ ] Player権限制御テスト
  
- [ ] **文脈別エラーハンドリングテスト**
  - [ ] 権限エラーの文脈対応テスト
  - [ ] 適切なエラーメッセージ・リダイレクト提案テスト

### Phase 5: 後方互換性削除・完全移行（Week 6）

#### **🗑️ 旧エンドポイント廃止**
- [ ] **Deprecated警告期間後の削除**
  - [ ] 旧パス `/api/users/{uid}/scenario` 系削除
  - [ ] 旧パス `/api/scenario/{id}` 削除
  
- [ ] **最終整合性確認**
  - [ ] OpenAPI仕様の完全更新
  - [ ] ドキュメント・ガイドライン最新化

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

#### **1. 後方互換性影響**
- **リスク**: フロントエンドでの既存API利用箇所の破綻
- **対策**: 段階的移行・Deprecated警告期間設定

#### **2. 権限制御複雑化**
- **リスク**: 文脈別権限チェックでのセキュリティホール
- **対策**: 包括的な権限テスト・ペネトレーションテスト実施

#### **3. OpenAPI仕様複雑化**
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