# API移行設計原則

> API Context-based Design移行で確立された設計判断・原則の明文化

## 📋 移行設計原則

### 🎯 第1弾移行で確立された設計判断

第1弾移行（`GET /api/scenario/{id}` → `GET /api/scenarios/{id}`）の実施で以下の設計原則が確立されました：

#### **1. パス変更のみ、レスポンス形式維持**
```http
✅ 推奨アプローチ:
旧API: GET /api/scenario/{id}        → 既存レスポンス形式
新API: GET /api/scenarios/{id}       → 同一レスポンス形式（完全同一）

❌ 非推奨アプローチ:
新API: GET /api/scenarios/{id}       → 新しいレスポンス形式
```

**理由**:
- **後方互換性確保**: フロントエンドへの影響を最小化
- **移行リスク最小化**: レスポンス変更による予期しない破綻を回避
- **段階的移行可能**: パス変更とレスポンス変更を分離

#### **2. 技術的負債の迅速削除**
```
移行完了 → 旧API即座削除 → 技術的負債解消
```

**判断基準**:
- 内部プロジェクトのため段階的移行期間を省略
- 重複コード・仕様による保守負荷を即座に解消
- フロントエンド未使用APIは影響なしで削除可能

### 🔄 標準移行フロー（第1弾で確立）

#### **Phase 1: 設計・仕様更新**
1. **設計判断明文化**: 移行方針・制約事項の文書化
2. **OpenAPI仕様調整**: 新API仕様作成・旧API非推奨マーク

#### **Phase 2: テスト先行修正**
1. **統合テスト修正**: 新APIパスへのテスト更新
2. **移行互換性テスト**: 新旧API同一レスポンス確認

#### **Phase 3: 実装修正**
1. **新エンドポイント実装**: 既存ロジック流用
2. **旧エンドポイント廃止警告**: ヘッダー・ログ出力

#### **Phase 4: 検証・完了**
1. **テスト実行**: 新API動作確認・既存機能影響確認
2. **フロントエンド調査**: 使用状況確認・必要に応じて修正
3. **旧API削除**: 技術的負債の即座削除

---

## 🎯 第2弾移行適用（sessions/gm → game-masters/sessions）

### **移行対象**
```http
旧API: GET /api/sessions/gm/{gm_id}
新API: GET /api/game-masters/{uid}/sessions
```

### **設計原則適用**

#### **1. レスポンス形式維持（必須）**
既存実装の以下レスポンス形式を新APIでも完全に維持：

```typescript
// 維持するレスポンス形式
{
  id: string;
  title: string;
  status: string;
  scenarioId: string;
  scenarioTitle: string;
  createdAt: string;  // ISO形式
  updatedAt: string;  // ISO形式
}[]
```

#### **2. パス変更内容**
- **ロール名統一**: `gm` → `game-masters`
- **パラメータ名統一**: `gm_id` → `uid`（他APIとの一貫性）
- **RESTful化**: 文脈特化パス構造

#### **3. OpenAPI仕様調整**
- **新API仕様**: 実装に合わせたスキーマ定義
- **旧API仕様**: 非推奨マーク追加

### **制約事項・注意点**

#### **スキーマ整合性**
```yaml
# ❌ 誤ったスキーマ参照
schema:
  $ref: '../components/schemas/session.yaml#/SessionList'  # 汎用リスト形式

# ✅ 正しいスキーマ参照  
schema:
  $ref: '../components/schemas/session.yaml#/GMSessionList'  # 実装準拠形式
```

#### **実装ロジック流用**
```typescript
// 既存ロジックの完全流用
const sessions = await getSessionsByGmId(c.env.NEON_CONNECTION_STRING, gmId);

// レスポンス形式の完全維持
return c.json(
  sessions.map((session) => ({
    id: session.id,
    title: session.title,
    status: session.status,
    scenarioId: session.scenarioId,
    scenarioTitle: session.scenarioTitle,
    createdAt: session.createdAt.toISOString(),
    updatedAt: session.updatedAt.toISOString(),
  }))
);
```

---

## 📊 移行成功指標

### **技術指標**
- ✅ **レスポンス同一性**: 新旧API完全同一レスポンス
- ✅ **テスト通過率**: 100%（既存機能影響なし）
- ✅ **OpenAPI準拠**: 仕様と実装の完全一致

### **プロセス指標**
- ✅ **テスト先行**: テスト修正後の実装修正
- ✅ **段階的検証**: 各Phase完了後の動作確認
- ✅ **技術的負債削除**: 移行完了後の即座削除

---

## 🚨 避けるべき反パターン

### **1. レスポンス形式変更**
```typescript
❌ 新APIで新しいレスポンス形式を導入
❌ フィールド名の変更（title → name等）
❌ 新フィールドの追加・既存フィールドの削除
```

### **2. 実装の大幅変更**
```typescript
❌ 新APIで異なるDBクエリ・ビジネスロジック
❌ 認証・権限チェックの変更
❌ エラーハンドリングの変更
```

### **3. 段階的移行の長期化**
```typescript
❌ 新旧API長期間並行運用
❌ 技術的負債の放置
❌ 複雑な移行スケジュール
```

### **4. 未使用API移行の実施**
```typescript
❌ フロントエンド使用状況の事前確認不足
❌ 不要な移行作業による工数浪費
❌ 使用されないAPIの実装・保守
```

**第2弾で発見された問題**: 移行完了後に新API `GET /api/game-masters/{uid}/sessions` がフロントエンドで未使用と判明

**第1弾調査ミス問題**: 使用中API `GET /api/scenario/{id}` を誤って削除 → フロントエンド前方修正で解決

---

## 🎯 次回移行への適用

### **テンプレート化項目**
1. **設計判断**: パス変更のみ・レスポンス維持
2. **作業順序**: **事前調査** → 設計 → テスト → 実装 → 検証
3. **技術的負債**: 移行完了後即座削除

### **事前調査プロセス（第2弾追加・緊急改善）**

⚠️ **重要**: 第1弾で調査ミスによる誤削除が発生。以下の強化プロセス必須。

```
1. フロントエンド使用状況調査（多角的検索必須）
   ├── 直接パス検索: grep -r "/api/{エンドポイント}/" apps/frontend/
   ├── HonoClient検索: grep -r "\.{エンドポイント}\[" apps/frontend/
   ├── APIクライアント検索: grep -r "apiClient.*{エンドポイント}" apps/frontend/
   ├── 型定義検索: grep -r "{エンドポイント}.*\$get\|{エンドポイント}.*API" apps/frontend/
   └── テストファイル検索: テスト内での使用確認

2. 削除前検証（必須プロセス）
   ├── フロントエンドビルド: エラー発生確認
   ├── E2Eテスト実行: 機能動作確認
   ├── 型チェック実行: 型エラー発生確認
   └── 段階的削除: 仕様→テスト→実装の順序

3. 移行必要性判定
   ├── 使用中 → 通常移行プロセス
   ├── 未使用（検証済み） → 移行中止・削除候補追加
   └── 将来利用予定 → ステークホルダー確認

4. 調査ミス発生時の復旧戦略
   ├── 前方修正: フロントエンド側で新APIに置き換え（推奨）
   ├── 後方復旧: 旧API復旧（一時的対応）
   ├── 影響範囲確認: 削除による機能停止範囲
   └── 迅速対応: 24時間以内の機能復旧
```

### **カスタマイズ項目**
1. **移行内容**: パス変更内容・ロール名等
2. **影響範囲**: フロントエンド使用状況・テスト修正範囲
3. **検証方法**: 特定APIに応じた動作確認
4. **📍 新追加**: 移行対象API の必要性・使用状況

---

## 🏷️ メタデータ

**作成日**: 2025-08-12  
**適用対象**: 第2弾移行（sessions/gm → game-masters/sessions）  
**関連文書**: 
- `api-migration-phase1-completion.md` (第1弾移行完了報告)
- `api-context-based-refactoring-todo.md` (全体移行計画)

**ステータス**: 設計原則確立・第2弾移行適用  
**承認**: 第1弾移行実績による原則確立済み  
**重要教訓**: 調査ミス対応・復旧戦略確立

#api-design #migration-principles #design-decisions #backend-refactoring #restful-design