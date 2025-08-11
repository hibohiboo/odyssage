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
      manage: true;       // 自分が作成したセッションの管理
      invite: true;       // プレイヤーの招待
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

## 🎯 文脈ベースAPI設計の課題

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