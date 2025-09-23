# 緊急対応計画 - セッション参加機能データ永続化問題

**日付**: 2025-09-23
**緊急度**: 🚨 最高
**対応期限**: 即座開始、1週間以内完了

## 🚨 緊急事態の概要

**問題**: セッション参加機能がLocalStorageに完全依存し、実用性がない
**影響**: マルチユーザー環境で機能せず、データ消失リスクあり
**発見経緯**: BDDテスト成功後の実装状況詳細調査

## ⚡ 即座実行すべきアクション

### 1. ステークホルダー通知（即座）

**対象**: プロダクトオーナー、開発チーム、テストユーザー
**内容**:
```
件名: 【緊急】セッション参加機能のデータ永続化問題発見

現在のセッション参加機能はLocalStorageに依存しており、
以下の重大な問題があります：

- ブラウザを閉じるとデータが消失
- 複数ユーザー間でのデータ共有不可
- 実際のプロダクション環境では機能しない

緊急でデータベース連携の実装が必要です。
```

### 2. 開発優先度の変更（本日中）

**変更前**: セッション参加機能の拡張・新機能開発
**変更後**: データ永続化基盤の緊急実装

## 📋 緊急実装ロードマップ

### フェーズ1: データベース基盤（1-2日）

**1日目**:
- [ ] `session_participants` テーブル作成
- [ ] マイグレーションスクリプト作成
- [ ] 基本的なCRUD操作実装

**2日目**:
- [ ] バックエンドAPI実装開始
- [ ] 単体テスト作成

### フェーズ2: API実装（2-3日）

**3-4日目**:
- [ ] `POST /sessions/:id/join` 実装
- [ ] `DELETE /sessions/:id/leave` 実装
- [ ] `GET /sessions/:id/participants` 実装
- [ ] API統合テスト

**5日目**:
- [ ] エラーハンドリング実装
- [ ] API仕様書更新

### フェーズ3: フロントエンド統合（2-3日）

**6-7日目**:
- [ ] SessionDataService のAPI連携実装
- [ ] LocalStorage依存から脱却
- [ ] フロントエンド統合テスト

**8日目**:
- [ ] BDDテストの実データ対応
- [ ] E2Eテスト実行・検証

## 🛠️ 実装詳細

### データベーススキーマ（緊急）

```sql
-- セッション参加者テーブル
CREATE TABLE odyssage.session_participants (
  session_id UUID REFERENCES odyssage.sessions(id) ON DELETE CASCADE,
  user_id VARCHAR(64) REFERENCES odyssage.users(id) ON DELETE CASCADE,
  joined_at TIMESTAMP DEFAULT NOW(),
  status VARCHAR(20) DEFAULT 'active',
  PRIMARY KEY (session_id, user_id)
);

-- インデックス作成
CREATE INDEX idx_session_participants_session_id ON odyssage.session_participants(session_id);
CREATE INDEX idx_session_participants_user_id ON odyssage.session_participants(user_id);
```

### APIエンドポイント仕様（緊急）

```typescript
// POST /sessions/:id/join
interface JoinSessionRequest {
  sessionId: string;
}

interface JoinSessionResponse {
  success: boolean;
  participantId: string;
  joinedAt: string;
}

// GET /sessions/:id/participants
interface GetParticipantsResponse {
  participants: Array<{
    userId: string;
    userName: string;
    joinedAt: string;
    status: string;
  }>;
  totalCount: number;
}
```

### フロントエンド変更点（緊急）

```typescript
// Before: LocalStorage依存
const sessionData = localStorage.getItem(`session_${sessionId}`);

// After: API連携
const sessionData = await api.get(`/sessions/${sessionId}`);
const participants = await api.get(`/sessions/${sessionId}/participants`);
```

## 🧪 テスト戦略

### 緊急テスト項目

1. **データベーステスト**
   - [ ] 参加者テーブルの作成・削除
   - [ ] 重複参加の防止
   - [ ] 外部キー制約の動作

2. **APIテスト**
   - [ ] セッション参加API
   - [ ] 参加者一覧取得API
   - [ ] エラーハンドリング

3. **統合テスト**
   - [ ] フロントエンド↔バックエンド連携
   - [ ] BDDテストの実データ実行
   - [ ] 複数ブラウザでの動作確認

## ⚠️ リスク管理

### 技術的リスク

| リスク | 確率 | 影響度 | 対策 |
|--------|------|--------|------|
| マイグレーション失敗 | 中 | 高 | バックアップ、ロールバック計画 |
| API設計変更 | 中 | 中 | 段階的実装、下位互換性 |
| フロントエンド統合失敗 | 低 | 高 | 既存UI保持、段階的移行 |

### ビジネスリスク

| リスク | 確率 | 影響度 | 対策 |
|--------|------|--------|------|
| テストユーザー影響 | 高 | 中 | 事前通知、データ移行支援 |
| リリース遅延 | 中 | 高 | 緊急優先度設定、リソース集中 |
| 品質低下 | 低 | 高 | 十分なテスト、段階的リリース |

## 📊 進捗管理

### デイリースタンドアップ項目

1. **昨日の進捗**: 実装完了項目
2. **今日の予定**: 実装予定項目
3. **ブロッカー**: 技術的課題・依存関係
4. **リスク**: 新たに発見したリスク

### 完了判定基準

- [ ] データベーススキーマ完成・デプロイ済み
- [ ] 全APIエンドポイント実装・テスト済み
- [ ] フロントエンド統合完了・動作確認済み
- [ ] BDDテスト実データで全通過
- [ ] 複数ユーザーでの動作確認完了

## 🔄 ロールバック計画

### 問題発生時の対応

1. **データベース問題**: マイグレーションロールバック
2. **API問題**: 旧バージョンAPI復旧
3. **フロントエンド問題**: LocalStorage版に一時復旧

### エスケレーション基準

- **8時間以内に解決できない場合**: 上位エスカレーション
- **重大なデータ損失リスク**: 即座にロールバック
- **ユーザー影響拡大**: プロダクトオーナー判断

## 📝 完了後の検証項目

### 機能検証
- [ ] セッション参加・退出の動作確認
- [ ] 複数デバイス間でのデータ同期確認
- [ ] データベースでのデータ永続化確認

### パフォーマンス検証
- [ ] 同時参加者数での負荷確認
- [ ] API応答時間の測定
- [ ] データベースクエリの効率確認

### セキュリティ検証
- [ ] 認証・認可の動作確認
- [ ] データアクセス権限の確認
- [ ] SQLインジェクション等の脆弱性チェック

## 🎯 成功基準

1. **技術的成功**: LocalStorage依存の完全排除
2. **機能的成功**: マルチユーザー環境での正常動作
3. **品質的成功**: 全テスト項目の通過
4. **ビジネス的成功**: ユーザー影響の最小化

---

**注意**: この計画は緊急対応計画であり、通常の開発プロセスを一部スキップしています。完了後は通常プロセスに戻し、必要なドキュメント整備・コードレビューを実施してください。