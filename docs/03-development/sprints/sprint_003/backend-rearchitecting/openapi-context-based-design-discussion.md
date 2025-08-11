# OpenAPI仕様と実装乖離：文脈ベースAPI設計議論

> バックエンドリアーキテクティング Issue #111 における OpenAPI 仕様と実装乖離に関する設計議論

## 📋 議論の背景

### 課題の発端
**backend-rearchitecting-implementation.md** で特定された課題：
> - [ ] OpenAPI仕様との実装乖離
> - [ ] エラーハンドリングの統一性
> - [ ] レスポンス形式の標準化度

### ユーザーからの重要な指摘
> 「APIは使われる文脈ごとに要件が違ってきます。一口にシナリオといっても、シナリオ作成者、GMの2つのユーザ区分によって、できることがことなります。シナリオ作者の文脈では、シナリオは作成者のみ編集可能、他の作成者のシナリオは公開されているものの閲覧のみ可能です。GMはシナリオ作成者が公開しているシナリオをストック可能です。」

### 議論の焦点
- **文脈ベース設計**: ユーザー区分による機能・権限の違い
- **API仕様の適合性**: 実際の業務要件とOpenAPI仕様の整合性
- **実装の一貫性**: 文脈に応じた適切な実装パターン

## 🎭 ユーザー区分と文脈分析

### シナリオに関わるステークホルダー

#### **📝 シナリオ作成者（Author）**
```typescript
interface ScenarioAuthor {
  role: 'author';
  permissions: {
    // 自分のシナリオに対する権限
    ownScenarios: {
      create: true;
      read: true;
      update: true;
      delete: true;
      publish: true;      // 公開設定の変更
      unpublish: true;    // 非公開設定への変更
    };
    // 他人のシナリオに対する権限
    othersScenarios: {
      create: false;
      read: true;         // 公開されているもののみ
      update: false;
      delete: false;
      publish: false;
      unpublish: false;
    };
  };
}
```

#### **🎲 ゲームマスター（GM）**
```typescript
interface GameMaster {
  role: 'gm';
  permissions: {
    // 公開シナリオに対する権限
    publicScenarios: {
      create: false;      // シナリオ自体は作成不可
      read: true;
      update: false;
      delete: false;
      stock: true;        // ストック（ブックマーク）機能
      unstock: true;      // ストック解除
    };
    // セッション管理権限
    sessions: {
      create: true;       // シナリオベースでセッション作成
      read: true;         // 全セッション閲覧
      update: true;       // 自分が作成したセッションのみ編集可能
      delete: true;       // 自分が作成したセッションのみ削除可能
      manage: true;       // 自分が作成したセッションの進行管理
      invite: true;       // プレイヤーの招待・除名
    };
  };
}
```

#### **👥 プレイヤー（Player）**
```typescript
interface Player {
  role: 'player';
  permissions: {
    // セッションに対する権限
    sessions: {
      create: false;      // セッション作成不可
      read: true;         // 参加セッション・公開セッションの閲覧
      update: false;      // セッション編集不可
      delete: false;      // セッション削除不可
      join: true;         // セッションへの参加申請
      leave: true;        // セッションからの離脱
      interact: true;     // セッション内での行動・発言
    };
    // シナリオに対する権限（プレイヤー視点）
    scenarios: {
      create: false;      // シナリオ作成不可
      read: true;         // 公開シナリオの閲覧
      update: false;      // シナリオ編集不可
      delete: false;      // シナリオ削除不可
    };
  };
}
```

### 文脈別の機能要件

#### **📖 シナリオ閲覧の文脈**

**作成者の文脈**:
```http
GET /api/users/{uid}/scenarios
# レスポンス：自分のシナリオ一覧（非公開含む）
{
  "scenarios": [
    {
      "id": "uuid",
      "title": "私のシナリオ",
      "visibility": "private",  // 非公開も表示
      "canEdit": true,          // 編集可能
      "canDelete": true,        // 削除可能
      "canPublish": true        // 公開設定変更可能
    }
  ]
}
```

**GMの文脈**:
```http
GET /api/scenarios/public
# レスポンス：公開シナリオ一覧（ストック機能付き）
{
  "scenarios": [
    {
      "id": "uuid",
      "title": "公開シナリオ",
      "authorName": "作成者名",
      "visibility": "public",   // 公開のみ
      "canEdit": false,         // 編集不可
      "canStock": true,         // ストック可能
      "isStocked": false        // 現在のストック状態
    }
  ]
}
```

#### **✏️ シナリオ編集の文脈**

**作成者による自分のシナリオ編集**:
```http
PUT /api/users/{uid}/scenario/{scenarioId}
Authorization: Bearer {author-jwt}
# 条件：uid === シナリオ作成者ID
```

**GMによる編集試行（エラーケース）**:
```http
PUT /api/users/{uid}/scenario/{scenarioId}
Authorization: Bearer {gm-jwt}
# レスポンス：403 Forbidden
{
  "error": "INSUFFICIENT_PERMISSION",
  "message": "シナリオの編集は作成者のみ可能です",
  "context": "scenario_edit_permission"
}
```

#### **🎮 セッション管理の文脈**

**GMの文脈（セッション一覧）**:
```http
GET /api/sessions/gm/{gm_id}
Authorization: Bearer {gm-jwt}
# レスポンス：GMが作成したセッション一覧（編集可能情報付き）
{
  "sessions": [
    {
      "id": "session-uuid",
      "title": "冒険セッション",
      "scenarioTitle": "謎の洞窟",
      "status": "準備中",
      "playerCount": 3,
      "maxPlayers": 5,
      "canEdit": true,        // 自分が作成したセッション
      "canDelete": true,
      "canManage": true,      // 進行管理可能
      "editUrl": "/gm/sessions/{id}/edit",
      "manageUrl": "/gm/sessions/{id}/manage"
    }
  ]
}
```

**プレイヤーの文脈（セッション一覧）**:
```http
GET /api/sessions
Authorization: Bearer {player-jwt}
# レスポンス：参加中・参加可能なセッション一覧（閲覧専用情報）
{
  "sessions": [
    {
      "id": "session-uuid",
      "title": "冒険セッション",
      "gmName": "マスター太郎",
      "scenarioTitle": "謎の洞窟",
      "status": "進行中",
      "playerCount": 3,
      "maxPlayers": 5,
      "canJoin": true,        // 参加可能
      "canView": true,        // 閲覧可能
      "isParticipating": false, // 現在の参加状況
      "joinUrl": "/player/sessions/{id}/join",
      "viewUrl": "/player/sessions/{id}"
    }
  ]
}
```

**GMによるセッション編集**:
```http
PUT /api/gm/{uid}/sessions/{sessionId}
Authorization: Bearer {gm-jwt}
# 条件：uid === セッション作成者のGM ID
{
  "title": "更新されたセッション名",
  "status": "進行中",
  "maxPlayers": 6
}
```

**プレイヤーによるセッション編集試行（エラーケース）**:
```http
PUT /api/gm/{uid}/sessions/{sessionId}
Authorization: Bearer {player-jwt}
# レスポンス：403 Forbidden
{
  "error": "ROLE_PERMISSION_DENIED",
  "message": "セッションの編集はGMのみ可能です",
  "context": "player",
  "allowedActions": ["view", "join", "leave"],
  "redirectSuggestion": "/player/sessions"
}
```

## 🔍 現在の実装状況調査結果

### 既存OpenAPI仕様の分析

#### **📋 現在のエンドポイント構成**

**シナリオ関連エンドポイント**:
```yaml
/api/scenarios              # 全シナリオ取得（認証不要）
/api/scenarios/public       # 公開シナリオ取得（認証不要）
/api/scenario/{id}          # 個別シナリオ取得
/api/users/{uid}/scenario   # ユーザーシナリオCRUD（認証必要）
/api/users/{uid}/stocked-scenarios           # ストック一覧
/api/users/{uid}/stocked-scenarios/{id}      # ストック操作
```

**セッション関連エンドポイント**:
```yaml
/api/sessions               # セッション一覧・作成
/api/sessions/{id}          # 個別セッション操作
/api/sessions/gm/{gm_id}    # GM別セッション一覧
/api/gm/{uid}/sessions/{id} # GMによるセッション更新
```

### 発見された乖離・課題

#### **🚨 重要な乖離ポイント**

**1. 文脈情報の不足**:
```yaml
# OpenAPI仕様（scenariosPublic.yaml）
get:
  summary: 公開シナリオ一覧取得
  # 問題：GMの文脈での利用を想定しているが仕様に明記なし
  schema:
    properties:
      id: string
      title: string
      overview: string
      updatedAt: string
    # 欠如：authorName, canStock, isStocked フィールド
```

```typescript
// 実際の実装需要（GMの文脈）
interface GMPublicScenarioResponse {
  id: string;
  title: string;
  overview: string;
  updatedAt: string;
  authorName: string;    // 仕様にない！
  canStock: boolean;     // 仕様にない！
  isStocked: boolean;    // 仕様にない！
}
```

**2. 権限情報の欠如**:
```yaml
# userScenario.yaml - GET /api/users/{uid}/scenario
# 問題：作成者の文脈で必要な権限情報が仕様にない
schema:
  properties:
    id: string
    title: string
    visibility: string
    updatedAt: string
    # 欠如：canEdit, canDelete, canPublish 等の権限情報
```

**3. エラーレスポンスの文脈対応不足**:
```yaml
# 現在の仕様：汎用エラーレスポンスのみ
400:
  $ref: '../components/schemas/response.yaml#/BadRequestResponse'
# 問題：文脈別の詳細エラー情報なし
```

#### **🎯 具体的な不整合例**

**シナリオストック機能**:

**OpenAPI仕様**:
```yaml
# userScenarioStocks.yaml
parameters:
  - name: user_id        # パラメータ名が不一致！
    in: path
# userScenarioStockItem.yaml
# 存在しない！POST/DELETE の仕様が未定義
```

**実際の実装**:
```typescript
// user.ts:94-108
.post(
  '/:uid/stocked-scenarios/:id',  // パラメータは 'uid' 
  vValidator('param', userScenarioParamSchema),
  async (c) => {
    // ストック作成ロジック
    await createScenarioStock(c.env.NEON_CONNECTION_STRING, {
      userId: param.uid,
      scenarioId: param.id,
    });
    return c.json({ message: 'Scenario stocked successfully' }, 201);
  }
)
```

### 文脈ベース要件との照合

#### **❌ 不足している仕様**

**シナリオ作成者の文脈**:
```typescript
// 必要だが仕様にない情報
interface AuthorScenarioListResponse {
  scenarios: Array<{
    id: string;
    title: string;
    visibility: 'public' | 'private';
    updatedAt: string;
    // 以下は仕様に存在しない
    canEdit: boolean;         // 常に true（自分のシナリオ）
    canDelete: boolean;       // 常に true
    canChangeVisibility: boolean; // 公開設定変更可能
    editUrl: string;          // 編集画面への直リンク
    stockCount?: number;      // 他ユーザーにストックされた回数
  }>;
}
```

**GMの文脈**:
```typescript
// 公開シナリオ一覧で必要だが仕様にない情報
interface GMPublicScenarioResponse {
  scenarios: Array<{
    id: string;
    title: string;
    overview: string;
    updatedAt: string;
    // 以下は仕様に存在しない
    authorName: string;       // 作成者名
    authorId: string;         // 作成者ID
    difficulty?: string;      // 難易度
    playerCount?: string;     // 推奨プレイヤー数
    playtime?: string;        // 想定プレイ時間
    isStocked: boolean;       // 現在のユーザーがストック済みか
    canCreateSession: boolean; // セッション作成可能か
    sessionCreateUrl: string; // セッション作成画面URL
  }>;
}
```

#### **⚠️ 権限制御の実装状況**

**現在の実装確認結果**:
```typescript
// user.ts - 権限制御の実装状況
.post('/:uid/scenario', ...) // ✅ JWT認証必要
.put('/:uid/scenario/:id', ...) // ❓ 所有者チェック実装要確認
.post('/:uid/stocked-scenarios/:id', ...) // ❓ 自分以外のシナリオのみストック可能かチェック要確認
```

**要調査事項**:
1. シナリオ編集時の所有者チェック実装
2. ストック時の重複チェック・自己ストック防止
3. 公開シナリオ取得時のストック状態判定
4. JWT内のロール情報と権限マッピング

#### **🎮 セッション関連の乖離分析**

**現在のセッションAPI仕様調査結果**:

**1. 基本エンドポイント構成**:
```yaml
GET /api/sessions                   # 一覧取得（gmIdクエリパラメータ対応）
POST /api/sessions                  # セッション作成
GET /api/sessions/{id}              # 個別セッション取得
GET /api/sessions/gm/{gm_id}        # GM別セッション一覧
PATCH /api/gm/{uid}/sessions/{id}   # GM専用セッション更新
```

**2. 現在の設計アプローチ分析**:

**✅ 部分的なHybrid Approach実装済み**:
- `/api/sessions` - 基本RESTfulエンドポイント + クエリパラメータで文脈対応
- `/api/sessions/gm/{gm_id}` - GM特化エンドポイント
- `/api/gm/{uid}/sessions/{id}` - GM専用管理エンドポイント

**❌ 不足している仕様・機能**:

**プレイヤー視点の文脈が完全欠如**:
```typescript
// 必要だが存在しない仕様
interface PlayerSessionRequirements {
  // プレイヤー参加可能なセッション一覧
  availableSessions: {
    endpoint: '/api/sessions/player/available'; // 存在しない！
    response: {
      gmName: string;           // 仕様にない
      canJoin: boolean;         // 仕様にない
      isParticipating: boolean; // 仕様にない
      scenario: {               // 詳細情報なし
        difficulty: string;
        playerCountRange: string;
      };
    };
  };
  
  // プレイヤーのセッション参加・離脱機能
  sessionActions: {
    joinEndpoint: '/api/sessions/{id}/actions/join';   // 存在しない！
    leaveEndpoint: '/api/sessions/{id}/actions/leave'; // 存在しない！
  };
}
```

**レスポンススキーマの文脈対応不足**:
```yaml
# sessions.yaml - 同一スキーマ（SessionList）を参照
# 問題：GM文脈とPlayer文脈で必要な情報が大きく異なる
GET /api/sessions:
  responses:
    '200':
      schema:
        $ref: 'session.yaml#/SessionList'  # 汎用スキーマ

GET /api/sessions/gm/{gm_id}:
  responses:
    '200':
      schema:
        $ref: 'session.yaml#/SessionList'  # 同じスキーマ！
```

**権限エラーの文脈対応**:
```yaml
# gmSessionUpdate.yaml - 良い例
'403':
  description: 権限エラー
  schema:
    properties:
      message:
        example: "このセッションの状態を更新する権限がありません"
# ✅ 権限エラーが文脈に応じて説明されている
```

## 🎯 API設計哲学: RESTful vs 文脈特化のバランス

### 根本的な設計思想の検討

#### **🤔 現在の課題：文脈による要件差異**

**同一リソースでも文脈によって大きく異なる情報需要**:

```typescript
// 同じ「セッション一覧」でも...

// GM文脈: 管理・編集に必要な情報
interface GMSessionListResponse {
  sessions: Array<{
    canEdit: boolean;       // 編集権限
    canDelete: boolean;     // 削除権限
    editUrl: string;        // 編集画面URL
    manageUrl: string;      // 進行管理URL
    playerManagement: {     // プレイヤー管理情報
      pendingInvitations: number;
      activePlayersCount: number;
    };
  }>;
}

// Player文脈: 参加・閲覧に必要な情報
interface PlayerSessionListResponse {
  sessions: Array<{
    gmName: string;         // GMの名前
    canJoin: boolean;       // 参加可能性
    isParticipating: boolean; // 参加状況
    joinUrl: string;        // 参加申請URL
    viewUrl: string;        // 閲覧URL
    scenario: {             // シナリオ詳細情報
      difficulty: string;
      playerCountRange: string;
    };
  }>;
}
```

#### **📊 3つのAPI設計アプローチの比較**

### **アプローチA: Pure RESTful Design**

**思想**: リソース中心、統一エンドポイント、内部で権限制御

```http
# 統一エンドポイント
GET /api/sessions
Authorization: Bearer {jwt}

# JWTのロール情報で内部的にレスポンス変更
# GM用・Player用のレスポンスを動的生成
```

**メリット**:
- ✅ RESTful原則に忠実
- ✅ エンドポイント数が少ない
- ✅ キャッシュ戦略がシンプル
- ✅ HTTP標準に準拠

**デメリット**:
- ❌ OpenAPI仕様で文脈別要件を表現困難
- ❌ フロントエンドでの利用パターンが不明確
- ❌ レスポンス形式が予測しづらい
- ❌ 型安全性の確保が困難

### **アプローチB: Complete Context Separation**

**思想**: ユーザー文脈別の完全分離設計

```http
# GM専用エンドポイント
GET /api/gm/sessions
POST /api/gm/sessions/{id}/invite-player
PUT /api/gm/sessions/{id}/manage

# Player専用エンドポイント  
GET /api/player/sessions/available
POST /api/player/sessions/{id}/join
GET /api/player/sessions/{id}/view
```

**メリット**:
- ✅ 文脈別要件を明確に表現
- ✅ 権限制御が明快
- ✅ 型安全性が高い
- ✅ フロントエンドでの利用が直感的

**デメリット**:
- ❌ エンドポイント数の爆発的増加
- ❌ RESTful原則からの逸脱
- ❌ コードの重複リスク
- ❌ メンテナンスコスト増加

### **アプローチC: Hybrid Approach**

**思想**: 基本RESTful + 文脈特化エンドポイント

```http
# 基本リソースエンドポイント（共通）
GET /api/sessions/{id}
POST /api/sessions

# 文脈特化エンドポイント（必要な場合のみ）
GET /api/sessions/gm/{gm_id}          # GM管理一覧
GET /api/sessions/player/available    # プレイヤー参加可能一覧
POST /api/sessions/{id}/actions/join  # プレイヤー参加アクション
PUT /api/sessions/{id}/actions/manage # GM管理アクション
```

**メリット**:
- ✅ RESTfulの基本を維持
- ✅ 必要な文脈特化に対応
- ✅ 段階的な拡張が可能
- ✅ 適度な複雑さで実用的

**デメリット**:
- ⚠️ 設計判断基準の明確化が必要
- ⚠️ 一貫性の維持にガバナンスが必要

### **🎯 現在の実装分析：既にHybrid Approachを採用**

#### **📊 現状の設計パターン確認**

**シナリオAPI**：比較的Pure RESTful
```http
GET /api/scenarios              # 汎用一覧
GET /api/scenarios/public       # 公開一覧（文脈特化）
GET /api/users/{uid}/scenario   # 作成者専用（文脈特化）
```

**セッションAPI**：明確なHybrid Approach
```http
# 基本RESTful
GET /api/sessions               # 汎用（クエリで文脈対応）
POST /api/sessions              # 汎用作成
GET /api/sessions/{id}          # 個別取得

# 文脈特化
GET /api/sessions/gm/{gm_id}    # GM管理専用
PATCH /api/gm/{uid}/sessions/{id} # GM更新専用
```

**✅ 判断**: 既存の設計は**Hybrid Approach**の方向性で実装されている

### **🤔 設計判断基準の提案**

#### **文脈特化エンドポイントが必要な条件**

**1. 情報需要の根本的差異**
```typescript
// 判断基準：同じリソースでも50%以上のフィールドが異なる場合
interface GMSessionView {
  canEdit: boolean;     // GM専用
  canDelete: boolean;   // GM専用
  editUrl: string;      // GM専用
  manageUrl: string;    // GM専用
  playerManagement: {}; // GM専用
}

interface PlayerSessionView {
  gmName: string;       // Player専用
  canJoin: boolean;     // Player専用
  joinUrl: string;      // Player専用
  scenario: {};         // Player専用（詳細情報）
}
// → 共通フィールドが50%未満 → 文脈特化エンドポイント推奨
```

**2. 権限制御の複雑性**
```typescript
// 判断基準：複雑な権限ロジックが必要な場合
if (requiresOwnershipCheck && hasComplexRoleBasedLogic) {
  // 文脈特化エンドポイント推奨
  // 例：/api/gm/{uid}/sessions/{id} （所有者チェック必須）
}
```

**3. セキュリティ境界の明確性**
```typescript
// 判断基準：誤操作防止が重要な場合
if (isDestructiveOperation || hasHighSecurityRequirement) {
  // 明示的な文脈特化エンドポイント推奨
  // 例：セッション削除・プレイヤー除名等
}
```

#### **RESTful統一エンドポイントで十分な条件**

**1. 基本的なCRUD操作**
```typescript
// 判断基準：権限チェックが単純で、レスポンスが類似
interface BasicResource {
  commonFields: 80%; // 80%以上が共通フィールド
  simplePermissionCheck: true; // JWTの基本権限チェックのみ
}
// → 統一エンドポイント + 内部権限制御で十分
```

**2. 主に参照系の操作**
```http
GET /api/scenarios/{id}  # 個別シナリオ閲覧（文脈によらず同じ情報）
```

## 🔬 文脈特化設計の課題

### 設計上の検討事項

#### **1. エンドポイント設計パターン**

**パターンA: ロールベースエンドポイント分離**
```http
# 作成者向け
GET /api/authors/{uid}/scenarios
PUT /api/authors/{uid}/scenarios/{id}

# GM向け  
GET /api/gm/scenarios/public
POST /api/gm/scenarios/{id}/stock
```

**パターンB: 統一エンドポイント + 権限制御**
```http
# 共通エンドポイント
GET /api/scenarios
PUT /api/scenarios/{id}

# JWTのロール情報で内部的に権限制御
```

#### **2. レスポンス形式の動的変更**

**課題**: 同一リソースでもユーザーの文脈で異なる情報が必要

```typescript
// 作成者向けレスポンス
interface AuthorScenarioResponse {
  id: string;
  title: string;
  visibility: 'public' | 'private';
  canEdit: boolean;     // 常に true
  canDelete: boolean;   // 常に true
  editUrl: string;      // 編集画面URL
}

// GM向けレスポンス  
interface GMScenarioResponse {
  id: string;
  title: string;
  authorName: string;   // 作成者名（作成者向けには不要）
  canStock: boolean;    // ストック可能か
  isStocked: boolean;   // 現在のストック状態
  sessionCreateUrl: string; // セッション作成URL
}
```

#### **3. エラーハンドリングの文脈対応**

**権限エラーの詳細化**:
```typescript
interface ContextualError {
  code: string;
  message: string;
  context: 'author' | 'gm' | 'player';
  allowedActions: string[];  // 代替可能なアクション
  redirectSuggestion?: string; // 適切な画面への誘導
}

// 例：GMがシナリオ編集を試行した場合
{
  "code": "ROLE_PERMISSION_DENIED",
  "message": "GMはシナリオの編集ができません",
  "context": "gm",
  "allowedActions": ["stock", "create_session", "view"],
  "redirectSuggestion": "/gm/scenarios/public"
}
```

## ✅ **設計方針の決定**

### **🎯 Hybrid Approach の具体的指針確定**

#### **明確な設計判断基準**

**📖 参照系操作 → RESTful統一エンドポイント**
```http
# 基本方針：情報取得は統一エンドポイントでシンプルに
GET /api/scenarios          # 全シナリオ一覧
GET /api/scenarios/public   # 公開シナリオ一覧  
GET /api/scenarios/{id}     # 個別シナリオ詳細
GET /api/sessions           # セッション一覧
GET /api/sessions/{id}      # 個別セッション詳細

# 権限・文脈による情報差は内部制御またはクエリパラメータで対応
GET /api/sessions?context=player    # プレイヤー文脈での一覧
GET /api/sessions?context=gm        # GM文脈での一覧
```

**✏️ 更新系操作 → 文脈特化エンドポイント**
```http
# 基本方針：データ変更は明確な権限・文脈分離
POST /api/users/{uid}/scenarios          # シナリオ作成（作成者文脈）
PUT /api/users/{uid}/scenarios/{id}      # シナリオ編集（作成者文脈）
POST /api/gm/{uid}/sessions              # セッション作成（GM文脈）
PUT /api/gm/{uid}/sessions/{id}          # セッション編集（GM文脈）
POST /api/player/{uid}/sessions/{id}/join    # セッション参加（プレイヤー文脈）
DELETE /api/player/{uid}/sessions/{id}/leave # セッション離脱（プレイヤー文脈）
```

#### **設計判断の根拠**

**参照系をRESTfulにする理由**:
- ✅ **キャッシュ効率**: 同一エンドポイントでCDNキャッシュが有効
- ✅ **実装シンプル性**: 権限に応じたフィールド追加・除外で対応可能
- ✅ **フロントエンド利便性**: 単一のAPIコールで基本情報取得
- ✅ **拡張性**: 新しい文脈が追加されても既存エンドポイント活用可能

**更新系を文脈特化にする理由**:
- 🔒 **セキュリティ**: 誤操作防止・権限境界の明確化
- 🎯 **意図の明確性**: URLから操作者の文脈・権限が明確
- ✅ **実装安全性**: 所有者チェック・権限検証が自然に実装される
- 📝 **監査性**: ログからユーザー文脈別の操作追跡が容易

### **📋 適用ルール**

#### **参照系API設計ルール**
```typescript
interface ReadOperationGuideline {
  pattern: 'GET /api/{resource}[/{id}]';
  responseStrategy: 'contextual_fields';
  authRequired: boolean; // 必要に応じて
  
  implementation: {
    // 基本情報は全文脈共通
    baseFields: ['id', 'title', 'createdAt', 'updatedAt'];
    
    // JWT解析で文脈判定、必要フィールド追加
    contextualFields: {
      author: ['canEdit', 'canDelete', 'editUrl'];
      gm: ['canStock', 'isStocked', 'authorName'];  
      player: ['gmName', 'canJoin', 'joinUrl'];
    };
  };
}
```

#### **更新系API設計ルール**
```typescript
interface UpdateOperationGuideline {
  pattern: 'POST|PUT|PATCH|DELETE /api/{role}/{uid}/{resource}[/{id}][/actions/{action}]';
  authRequired: true; // 必須
  ownershipCheck: true; // uid === JWT.sub 必須
  
  examples: [
    'POST /api/authors/{uid}/scenarios',           // シナリオ作成
    'PUT /api/authors/{uid}/scenarios/{id}',       // シナリオ編集  
    'POST /api/gm/{uid}/sessions',                 // セッション作成
    'PATCH /api/gm/{uid}/sessions/{id}',           // セッション状態更新
    'POST /api/player/{uid}/sessions/{id}/actions/join'  // 参加アクション
  ];
}
```

## 🤔 設計判断のポイント

### 議論すべき事項

#### **1. API設計哲学**

**Question**: RESTful vs 文脈特化設計のバランスは？

**選択肢**:
- A) 完全RESTful：リソース中心、権限は内部制御
- B) 文脈特化：ユーザー区分別のエンドポイント設計
- C) ハイブリッド：基本RESTful + 文脈特化エンドポイント

**考慮点**:
- API利用者（フロントエンド）の使いやすさ
- 権限制御の明確性・セキュリティ
- 将来の拡張性（新しいロールの追加など）

#### **2. OpenAPI仕様の表現方法**

**Question**: 文脈別の仕様をどう記述するか？

**検討案**:
```yaml
# OpenAPI 3.0での表現方法
paths:
  /scenarios:
    get:
      summary: シナリオ一覧取得
      responses:
        '200':
          description: Success
          content:
            application/json:
              schema:
                oneOf:
                  - $ref: '#/components/schemas/AuthorScenariosResponse'
                  - $ref: '#/components/schemas/GMScenariosResponse'
              examples:
                author_context:
                  summary: 作成者の文脈
                  value: { /* 作成者向けレスポンス例 */ }
                gm_context:
                  summary: GMの文脈
                  value: { /* GM向けレスポンス例 */ }
```

#### **3. 実装パターンの選択**

**Question**: バックエンドでの権限制御実装方法は？

**パターン検討**:
- **ミドルウェアレベル**: 各エンドポイントでJWT解析・権限チェック
- **サービス層**: ビジネスロジック層での文脈別処理
- **レスポンス変換**: 共通データを取得後、権限に応じて加工

## 📅 議論の進め方

### Phase 1: 現状把握
- [ ] 現在のOpenAPI仕様書の詳細確認
- [ ] 実装されているエンドポイントと権限制御の調査
- [ ] フロントエンドでの利用パターン確認

### Phase 2: 設計方針決定
- [ ] API設計哲学の合意形成
- [ ] 文脈別要件の詳細化
- [ ] エラーハンドリング方針の確定

### Phase 3: 実装計画
- [ ] OpenAPI仕様の更新計画
- [ ] 既存APIの修正範囲確定
- [ ] 段階的実装ロードマップ作成

## 🎯 期待される成果

### 設計成果物
- **文脈ベースAPI仕様書**: ユーザー区分別の詳細仕様
- **権限マトリックス**: 機能×ロール の権限一覧表
- **実装ガイドライン**: 一貫した実装パターン

### 品質向上
- **仕様と実装の整合性**: OpenAPI仕様との完全一致
- **エラーメッセージの統一**: 文脈に応じた適切なエラー応答
- **開発効率向上**: 明確な仕様に基づく実装・テスト

---

## 🏷️ メタデータ

**作成日**: 2025-08-10  
**関連Issue**: #111（バックエンドリアーキテクティング）  
**関連文書**: [[backend-rearchitecting-implementation.md]], [[ddd-architecture-discussion.md]]  
**ステータス**: 議論開始  
**参加者**: ユーザー、Claude

#discussion #openapi #api-design #context-based #permissions #backend