# セッション参加機能のデータ永続化問題分析レポート

**日付**: 2025-09-23
**ブランチ**: `id/120/bdd-test`
**調査担当**: Claude Code
**ステータス**: 🚨 緊急対応必要

## 📋 調査概要

セッション参加機能のBDDテスト完成後、実装状況を詳細調査した結果、**重大なデータ永続化問題**を発見。

## 🚨 発見された問題

### 1. ローカルストレージ依存問題

**影響範囲**: セッション参加機能全体

```typescript
// SessionDataService.ts - 完全モック実装
const MOCK_SESSIONS: SessionData[] = [
  {
    id: 'test-session-join',
    title: 'テストセッション（参加用）',
    // ... モックデータ
  }
];

// LocalStorageのみでの保存
localStorage.setItem(cacheKey, JSON.stringify(sessionData));
```

**問題点**:
- ブラウザを閉じると参加情報が消失
- 他のデバイスからアクセスしても参加情報が見えない
- 複数ユーザー間での参加者情報共有が不可能

### 2. データベーススキーマの不備

**現在のスキーマ**: `packages/database/src/schema.ts`

```sql
-- 存在するテーブル
sessions (id, gm_id, scenario_id, title, status, created_at, updated_at)
users (id, name)
scenarios (id, title, user_id, created_at, updated_at, overview, visibility)

-- ❌ 不足しているテーブル
session_participants -- セッション参加者管理テーブルが存在しない
```

### 3. バックエンドAPI未実装

**調査結果**: セッション参加関連のAPIが存在しない

```bash
# 実装済みAPI
GET /sessions        # セッション一覧取得
GET /sessions/:id    # セッション詳細取得

# ❌ 未実装API
POST /sessions/:id/join      # セッション参加
DELETE /sessions/:id/leave   # セッション退出
GET /sessions/:id/participants # 参加者一覧取得
```

## 📊 実装状況マトリックス

| 機能 | UI実装 | API実装 | DB永続化 | 実用性 |
|------|-------|---------|---------|-------|
| セッション詳細表示 | ✅ 完成 | ✅ 完成 | ✅ 完成 | ✅ |
| 参加確認ダイアログ | ✅ 完成 | ❌ なし | ❌ なし | ❌ |
| セッション参加処理 | ❌ モックのみ | ❌ なし | ❌ なし | ❌ |
| 参加者管理 | ❌ なし | ❌ なし | ❌ なし | ❌ |

## 🔍 ローカルストレージ依存箇所一覧

### フロントエンド依存箇所

1. **SessionDataService**: セッション詳細データ
2. **AutoSaveService**: セッション状態の自動保存
3. **SceneLoader**: シーンデータのキャッシュ
4. **認証関連**: ユーザートークン保存

### キーとなるLocalStorageキー

```javascript
// セッション関連
'odyssage_session_data_cache_${sessionId}'
'odyssage_session_state_${sessionId}'
'odyssage_autosave_timestamp_${sessionId}'

// プレイヤー関連
'odyssage_play_state'
'odyssage_current_session'
'odyssage_session_${sessionId}_scenes'

// 認証関連
'user'
'userToken'
```

## 🎯 BDDテストが成功している理由

BDDテストは以下の理由で成功している：

1. **UI検証のみ**: ダイアログの表示・ボタンの存在確認
2. **モックデータ対応**: テスト用モックデータが存在
3. **単一ブラウザ環境**: LocalStorageが機能する環境でのテスト

```gherkin
# 現在のBDDテスト（問題なし）
Scenario: セッション参加の基本フロー
  Given プレイヤーがセッション詳細画面を表示している
  When プレイヤーが「このセッションに参加」ボタンをクリックする
  Then 参加確認ダイアログが表示される
  And 「参加する」「キャンセル」ボタンが表示される
```

**テスト成功の条件**: UI表示のみを検証、実際の参加処理は未検証

## 🛠️ 必要な実装

### 1. データベーススキーマ拡張

```sql
-- セッション参加者テーブル
CREATE TABLE session_participants (
  session_id UUID REFERENCES sessions(id) ON DELETE CASCADE,
  user_id VARCHAR(64) REFERENCES users(id) ON DELETE CASCADE,
  joined_at TIMESTAMP DEFAULT NOW(),
  status VARCHAR(20) DEFAULT 'active',
  role VARCHAR(20) DEFAULT 'player',
  PRIMARY KEY (session_id, user_id)
);

-- セッション参加履歴テーブル（オプション）
CREATE TABLE session_participation_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID REFERENCES sessions(id) ON DELETE CASCADE,
  user_id VARCHAR(64) REFERENCES users(id) ON DELETE CASCADE,
  action VARCHAR(20) NOT NULL, -- 'joined', 'left', 'kicked'
  timestamp TIMESTAMP DEFAULT NOW(),
  notes TEXT
);
```

### 2. バックエンドAPI実装

```typescript
// POST /sessions/:id/join
export const joinSession = async (sessionId: string, userId: string) => {
  // 参加者をデータベースに追加
  // 重複参加チェック
  // セッション定員チェック
};

// DELETE /sessions/:id/leave
export const leaveSession = async (sessionId: string, userId: string) => {
  // 参加者をデータベースから削除
  // 参加履歴に記録
};

// GET /sessions/:id/participants
export const getSessionParticipants = async (sessionId: string) => {
  // セッション参加者一覧を取得
};
```

### 3. フロントエンド統合

```typescript
// SessionDataService を実API連携に変更
class SessionDataService {
  async joinSession(sessionId: string): Promise<void> {
    // LocalStorage → API呼び出しに変更
    await api.post(`/sessions/${sessionId}/join`);
  }

  async getSessionWithParticipants(sessionId: string): Promise<SessionWithParticipants> {
    // モックデータ → 実API呼び出しに変更
    return api.get(`/sessions/${sessionId}`);
  }
}
```

## 📈 優先度と影響度

### 🔴 最高優先度（即座対応必要）

1. **セッション参加者テーブル作成**
2. **セッション参加API実装**
3. **フロントエンド統合テスト**

### 🟡 中優先度（次スプリント）

1. **参加履歴機能**
2. **定員管理機能**
3. **参加者ロール管理**

### 🟢 低優先度（将来機能）

1. **参加者招待機能**
2. **参加者チャット機能**
3. **参加者評価システム**

## ⚠️ リスク評価

### 技術的リスク

- **データ移行**: 既存LocalStorageデータの移行が困難
- **API設計**: 既存セッションAPIとの整合性
- **パフォーマンス**: 参加者数増加時のクエリ効率

### ビジネスリスク

- **ユーザー体験**: 現在のテストユーザーのデータ消失
- **機能信頼性**: マルチユーザー環境での動作不具合
- **スケーラビリティ**: 同時参加者数の制限

## 📝 推奨アクション

### 即座実行

1. **緊急通知**: ステークホルダーにデータ永続化問題を報告
2. **テストユーザー通知**: LocalStorageデータ消失リスクを周知
3. **開発優先度変更**: データ永続化実装を最優先に変更

### 短期実装（1-2週間）

1. **データベーススキーマ拡張**
2. **基本参加API実装**
3. **フロントエンド統合**
4. **実データでのBDDテスト実行**

### 中期実装（1ヶ月）

1. **参加者管理機能完成**
2. **エラーハンドリング強化**
3. **パフォーマンス最適化**

## 📚 関連ドキュメント

- **BDD仕様**: `packages/bdd-e2e-test/e2e/features/player/session-joining.feature`
- **現在の実装**: `apps/frontend/src/page/player/services/SessionDataService.ts`
- **データベーススキーマ**: `packages/database/src/schema.ts`
- **API仕様**: `apps/backend/src/route/session.ts`

## 🏁 結論

**現在のセッション参加機能は見た目上は完成しているが、実用性がない状態**。LocalStorageに依存した実装のため、実際のマルチユーザー環境では機能しない。

緊急でデータ永続化の実装が必要。次のスプリントでの最優先課題として扱うべき。