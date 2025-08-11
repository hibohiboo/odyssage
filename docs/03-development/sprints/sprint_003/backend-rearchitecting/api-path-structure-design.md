# API パス構造設計

> 文脈特化エンドポイントの統一的な階層構造設計

## 📋 議論の背景

### 前回の決定事項
- **設計方針**: Hybrid Approach（参照・RESTful、更新・文脈特化）
- **更新系エンドポイント**: 文脈特化で明示的権限分離
- **基本パターン**: `POST|PUT|PATCH|DELETE /api/{role}/{uid}/{resource}[/{id}][/actions/{action}]`

### 今回の検討事項
- **ユーザーロールの統一**: 英語・日本語対応と役割定義
- **パス構造の詳細設計**: 一貫性のある階層構造
- **既存APIとの整合性**: 段階的移行の考慮

## 👥 ユーザーロール定義

### ロール対応表

| 日本語 | 英語 | API Path | 略称 | 説明 |
|--------|------|----------|------|------|
| シナリオ作成者 | Author | `/api/authors/{uid}/` | `authors` | シナリオ・コンテンツを創作するユーザー |
| ゲームマスター | Game Master | `/api/game-masters/{uid}/` | `game-masters` | セッションを管理・進行するユーザー |
| プレイヤー | Player | `/api/players/{uid}/` | `players` | セッションに参加するユーザー |

### 詳細な役割説明

#### **📝 Authors（シナリオ作成者）**
```typescript
interface AuthorRole {
  primaryFunction: 'content_creation';
  permissions: {
    scenarios: {
      create: true;     // シナリオ作成
      edit: 'own_only'; // 自分のシナリオのみ編集
      delete: 'own_only'; // 自分のシナリオのみ削除
      publish: true;    // 公開設定変更
    };
    sessions: {
      create: false;    // セッション作成不可
      view: 'public_only'; // 公開セッションの閲覧のみ
    };
  };
  
  keyFeatures: [
    'シナリオ企画・執筆',
    'コンテンツ公開・非公開制御', 
    'シナリオ利用状況確認',
    'フィードバック・レビュー管理'
  ];
}
```

#### **🎲 Game Masters（ゲームマスター）**
```typescript
interface GMRole {
  primaryFunction: 'session_management';
  permissions: {
    scenarios: {
      create: false;    // シナリオ作成不可
      edit: false;      // シナリオ編集不可
      view: 'public_only'; // 公開シナリオ閲覧
      stock: true;      // シナリオストック（ブックマーク）
    };
    sessions: {
      create: true;     // セッション作成
      edit: 'own_only'; // 自分のセッションのみ編集
      delete: 'own_only'; // 自分のセッションのみ削除
      manage: 'own_only'; // 進行管理・参加者管理
    };
  };
  
  keyFeatures: [
    'セッション企画・作成',
    'プレイヤー招待・管理',
    'ゲーム進行・ルール裁定',
    'セッション状態管理'
  ];
}
```

#### **👥 Players（プレイヤー）**
```typescript
interface PlayerRole {
  primaryFunction: 'session_participation';
  permissions: {
    scenarios: {
      create: false;    // シナリオ作成不可
      edit: false;      // シナリオ編集不可
      view: 'public_only'; // 公開シナリオ閲覧のみ
    };
    sessions: {
      create: false;    // セッション作成不可
      edit: false;      // セッション編集不可
      view: 'participating_and_public'; // 参加中・公開セッション閲覧
      join: true;       // セッション参加申請
      leave: true;      // セッション離脱
      interact: true;   // セッション内行動・発言
    };
  };
  
  keyFeatures: [
    'セッション参加申請・承認',
    'ゲーム内キャラクター操作',
    'セッション内コミュニケーション',
    'プレイ履歴管理'
  ];
}
```

## 🏗️ パス構造設計

### 基本パターンの詳細化

#### **更新系エンドポイント構造**
```
HTTP_METHOD /api/{role}/{uid}/{resource}[/{id}][/actions/{action}]

構成要素：
- {role}: authors | game-masters | players
- {uid}: ユーザーID（JWT.subと一致必須）
- {resource}: scenarios | sessions | stocks など
- {id}: リソースID（オプション）
- /actions/{action}: 特定アクション（オプション）
```

#### **参照系エンドポイント構造**
```
GET /api/{resource}[/{id}][?context={role}&uid={uid}]

構成要素：
- {resource}: scenarios | sessions
- {id}: リソースID（オプション）  
- context: 文脈パラメータ（オプション）
- uid: ユーザーID（認証時のみ）
```

## 📝 具体的なエンドポイント設計

### **Authors（シナリオ作成者）**

#### **シナリオ管理**
```http
# シナリオ作成
POST /api/authors/{uid}/scenarios
{
  "title": "冒険の始まり",
  "overview": "初心者向けシナリオ",
  "visibility": "private"
}

# シナリオ編集
PUT /api/authors/{uid}/scenarios/{scenario_id}
{
  "title": "更新されたタイトル",
  "visibility": "public"
}

# シナリオ削除
DELETE /api/authors/{uid}/scenarios/{scenario_id}

# 公開設定変更
PATCH /api/authors/{uid}/scenarios/{scenario_id}/actions/publish
{
  "visibility": "public"
}
```

#### **作成者統計・管理**
```http
# 作成シナリオ統計
GET /api/authors/{uid}/scenarios/stats

# 利用状況確認
GET /api/authors/{uid}/scenarios/{scenario_id}/usage
```

### **Game Masters（ゲームマスター）**

#### **セッション管理**
```http
# セッション作成
POST /api/game-masters/{uid}/sessions
{
  "scenario_id": "uuid",
  "title": "週末冒険セッション",
  "max_players": 4
}

# セッション編集
PUT /api/gm/{uid}/sessions/{session_id}
{
  "title": "更新されたセッション名",
  "max_players": 5
}

# セッション状態管理
PATCH /api/gm/{uid}/sessions/{session_id}/actions/start
PATCH /api/gm/{uid}/sessions/{session_id}/actions/pause
PATCH /api/gm/{uid}/sessions/{session_id}/actions/complete

# セッション削除
DELETE /api/gm/{uid}/sessions/{session_id}
```

#### **参加者管理**
```http
# プレイヤー招待
POST /api/gm/{uid}/sessions/{session_id}/actions/invite
{
  "player_id": "player_uuid",
  "message": "参加しませんか？"
}

# プレイヤー除名
DELETE /api/gm/{uid}/sessions/{session_id}/players/{player_id}
```

#### **シナリオストック管理**
```http
# シナリオストック
POST /api/gm/{uid}/stocks
{
  "scenario_id": "uuid"
}

# ストック解除
DELETE /api/gm/{uid}/stocks/{scenario_id}
```

### **Players（プレイヤー）**

#### **セッション参加**
```http
# セッション参加申請
POST /api/players/{uid}/sessions/{session_id}/actions/join
{
  "character_name": "勇者アレクス",
  "message": "参加希望です"
}

# セッション離脱
DELETE /api/players/{uid}/sessions/{session_id}/actions/leave

# 参加承認応答
PATCH /api/players/{uid}/sessions/{session_id}/actions/accept-invitation
PATCH /api/players/{uid}/sessions/{session_id}/actions/decline-invitation
```

#### **セッション内行動**
```http
# ゲーム内アクション
POST /api/players/{uid}/sessions/{session_id}/actions/game-action
{
  "action_type": "move",
  "details": "北の部屋に移動"
}

# メッセージ送信
POST /api/players/{uid}/sessions/{session_id}/actions/message
{
  "message": "こんにちは皆さん！",
  "type": "chat"
}
```

## 🔍 既存APIとの比較・移行検討

### 現在のエンドポイント
```http
# 現在の構造
GET /api/scenarios
GET /api/scenarios/public  
POST /api/users/{uid}/scenario          # → authors
GET /api/users/{uid}/scenario           # → authors
PUT /api/users/{uid}/scenario/{id}      # → authors
POST /api/users/{uid}/stocked-scenarios/{id}  # → gm/stocks

GET /api/sessions
POST /api/sessions                      # → gm
GET /api/sessions/{id}
GET /api/sessions/gm/{gm_id}            # → gm
PATCH /api/gm/{uid}/sessions/{id}       # ✅ 既に新構造
```

### 移行マッピング

| 現在のエンドポイント | 新しい構造 | 変更理由 |
|---------------------|------------|----------|
| `POST /api/users/{uid}/scenario` | `POST /api/authors/{uid}/scenarios` | 役割の明確化・複数形統一 |
| `PUT /api/users/{uid}/scenario/{id}` | `PUT /api/authors/{uid}/scenarios/{id}` | 同上 |
| `POST /api/sessions` | `POST /api/gm/{uid}/sessions` | GM文脈の明確化 |
| `POST /api/users/{uid}/stocked-scenarios/{id}` | `POST /api/gm/{uid}/stocks` | リソース名の簡潔化 |

## ⚡ 設計上の考慮事項

### **1. 一貫性の確保**

#### **複数形統一**
```http
✅ 推奨: /api/authors/{uid}/scenarios
❌ 非推奨: /api/authors/{uid}/scenario

理由: RESTful慣習・直感的理解
```

#### **アクション名の統一**
```http
# セッション状態管理
/actions/start    # 開始
/actions/pause    # 一時停止  
/actions/complete # 完了

# 参加者管理
/actions/join     # 参加
/actions/leave    # 離脱
/actions/invite   # 招待
```

### **2. セキュリティ考慮**

#### **所有者チェック必須**
```typescript
// 実装例
app.post('/api/authors/:uid/scenarios', async (c) => {
  const pathUid = c.req.param('uid');
  const jwtUid = c.get('jwtPayload').sub;
  
  if (pathUid !== jwtUid) {
    return c.json({ error: 'UNAUTHORIZED' }, 403);
  }
  
  // 処理続行
});
```

#### **ロール検証**
```typescript
// JWT内のロール情報確認
const userRoles = c.get('jwtPayload').roles;
if (!userRoles.includes('author')) {
  return c.json({ error: 'INSUFFICIENT_ROLE' }, 403);
}
```

### **3. エラーハンドリング**

#### **文脈別エラーメッセージ**
```typescript
// Authors文脈
{
  "error": "SCENARIO_NOT_FOUND",
  "message": "指定されたシナリオは見つかりません",
  "context": "author",
  "suggestions": ["シナリオ一覧を確認", "新しいシナリオを作成"]
}

// GM文脈
{
  "error": "SESSION_CREATION_FAILED", 
  "message": "セッションの作成に失敗しました",
  "context": "gm",
  "suggestions": ["シナリオが公開されているか確認", "再試行"]
}
```

## 🤔 議論ポイント

### **1. ロール名の英語表記**

**Question**: `gm` vs `game-masters` vs `masters` ?

**考慮点**:
- URL の簡潔性 vs 明確性
- 既存システムとの整合性
- 国際化対応

**提案**: `gm` （簡潔・直感的・既存実装との一貫性）

### **2. アクションエンドポイントの必要性**

**Question**: `/actions/{action}` vs 専用HTTPメソッド？

**例**:
```http
# パターンA: アクション指定
POST /api/players/{uid}/sessions/{id}/actions/join

# パターンB: 専用リソース
POST /api/players/{uid}/sessions/{id}/participation
DELETE /api/players/{uid}/sessions/{id}/participation
```

### **3. 段階的移行戦略**

**Question**: 一括移行 vs 段階的移行？

**考慮点**:
- フロントエンドへの影響
- 後方互換性の維持期間
- 開発・テスト工数

---

## 🏷️ メタデータ

**作成日**: 2025-08-10  
**関連Issue**: #111（バックエンドリアーキテクティング）  
**関連文書**: [[openapi-context-based-design-discussion.md]], [[backend-rearchitecting-implementation.md]]  
**ステータス**: パス構造設計検討中  
**参加者**: ユーザー、Claude

#discussion #api-design #path-structure #roles #endpoints #backend