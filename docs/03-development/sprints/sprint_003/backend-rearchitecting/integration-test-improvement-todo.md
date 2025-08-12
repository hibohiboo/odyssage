# 統合テスト品質改善 TODOリスト

**作成日**: 2025-08-12  
**基づくドキュメント**: integration-test-quality-improvement-discussion.md  
**目的**: SonarJS警告解消とテスト可読性向上

## 📋 TODOリスト

### フェーズ1: 共通コード基盤作成（高優先度）

#### 1. 共通APIクライアント実装
- [ ] **IntegrationTestApiクラス作成**
  - ファイル: `apps/backend/test/integrations/helpers/IntegrationTestApi.ts`
  - 内容:
    - ユーザー管理API (`getUser`, `putUser`)
    - セッション管理API (`createSession`, `getGmSessions`, `getSessionById`)
    - シナリオ管理API (`createScenario`, `getScenarios`, `updateScenario`)
    - 認証ヘッダー管理
    - エラーハンドリング標準化

#### 2. 統一フィクスチャー実装
- [ ] **TestFixturesクラス作成**
  - ファイル: `apps/backend/test/integrations/helpers/TestFixtures.ts`
  - 内容:
    - `createTestUsers()` - 標準テストユーザー作成
    - `createTestScenarios()` - 標準シナリオデータ作成
    - `createTestSessions()` - 標準セッションデータ作成
    - `cleanupAllTables()` - 全テーブルクリーンアップ
    - テストデータ定数（ID、名前など）

#### 3. ヘルパー関数構成
- [ ] **ヘルパーディレクトリ作成**
  - ディレクトリ: `apps/backend/test/integrations/helpers/`
  - エクスポート用indexファイル作成

### フェーズ2: 既存テスト移行（中優先度）

#### 4. game-master-session.spec.ts リファクタリング
- [ ] **共通APIクライアント適用**
  - `createSession` ヘルパー関数をAPIクライアントに置換
  - `getGMSessions` ヘルパー関数をAPIクライアントに置換
  
- [ ] **値ベース検証への移行**
  - `toHaveProperty` + `typeof` チェックを `toEqual` に統合
  - レスポンス検証の簡潔化
  ```typescript
  // 変更前
  expect(data).toHaveProperty('id');
  expect(data).toHaveProperty('gmId', testGMId);
  expect(typeof data.id).toBe('string');
  
  // 変更後
  expect(data).toEqual({
    id: expect.any(String),
    gmId: testGMId,
    scenarioId: testSession.scenarioId,
    title: testSession.title,
    status: '準備中',
    createdAt: expect.any(String),
  });
  ```

#### 5. session-gm.spec.ts リファクタリング
- [ ] **APIクライアント適用と値検証移行**
  - 重複する `getSessionsByGm` 関数を統合
  - 配列検証を `toContainEqual` で実装
  - レスポンススキーマ検証の簡潔化

#### 6. user-management.spec.ts リファクタリング
- [ ] **APIクライアント適用**
  - `getUser`, `putUser` ヘルパーをAPIクライアントに統合
  - 値ベース検証への移行

#### 7. その他テストファイル順次移行
- [ ] **session.spec.ts** - APIクライアント適用
- [ ] **scenario-*.spec.ts** - 共通化とフィクスチャー適用
- [ ] **user-stock.spec.ts** - APIクライアント適用
- [ ] **sessions-list.spec.ts** - 値検証移行
- [ ] **session-update.spec.ts** - 統合テストAPI適用
- [ ] **graph-*.spec.ts** - GraphDB関連の共通化検討

### フェーズ3: 品質向上とメンテナンス性改善（低優先度）

#### 8. テスト構造改善
- [ ] **describe構造の統一**
  - 正常系/異常系/認証認可の明確な分離
  - テストケース名の統一フォーマット

#### 9. エラーハンドリング標準化
- [ ] **エラーレスポンス検証の統一**
  ```typescript
  // 統一フォーマット検討
  expect(res.status).toBe(400);
  expect(await res.json()).toEqual({
    message: expect.any(String)
  });
  ```

#### 10. パフォーマンス最適化
- [ ] **テスト実行時間の測定と改善**
  - 不要なデータベース操作の削減
  - 並列実行可能なテストの特定
  - フィクスチャーのメモリ効率化

### フェーズ4: 文書化と標準化

#### 11. テスト記述ガイドライン作成
- [ ] **統合テスト記述ガイド**
  - ファイル: `apps/backend/test/integrations/README.md`
  - 内容:
    - APIクライアント使用方法
    - 値ベース検証のパターン
    - フィクスチャー使用ルール
    - ネーミング規則

#### 12. レビュー基準策定
- [ ] **コードレビューチェックリスト**
  - 共通化可能なコードの特定方法
  - 値検証のベストプラクティス
  - SonarJS警告の回避パターン

## 🎯 各フェーズの完了条件

### フェーズ1完了条件
- [ ] `IntegrationTestApi`クラスが動作する
- [ ] `TestFixtures`クラスが動作する
- [ ] 既存テストが破綻しない（後方互換性維持）

### フェーズ2完了条件
- [ ] 全統合テストが新しい共通基盤を使用
- [ ] SonarJS重複コード警告が50%以上削減
- [ ] テスト可読性が向上（主観評価）

### フェーズ3完了条件
- [ ] テスト実行時間が現状と同等以下
- [ ] エラーメッセージの一貫性確保
- [ ] 新規テスト追加時の工数削減

### フェーズ4完了条件
- [ ] ガイドライン文書の完成
- [ ] チーム内での合意形成
- [ ] 新メンバーへの説明可能性確保

## ⚠️ 注意事項

### 移行時の留意点
1. **段階的移行**: 一度に全ファイルを変更せず、1-2ファイルずつ
2. **テスト通過確保**: 各段階でテスト成功を確認
3. **レビュー徹底**: 可読性向上を実際に確認

### 品質確保
1. **後方互換性**: 既存の動作を破綻させない
2. **パフォーマンス**: テスト実行時間の悪化を避ける
3. **学習コスト**: 新しい仕組みの理解しやすさ

## 📊 進捗追跡

- **フェーズ1**: ✅ 3/3完了
  - ✅ IntegrationTestApiクラス作成
  - ✅ TestFixturesクラス作成
  - ✅ ヘルパーディレクトリ作成

- **フェーズ2**: 🔄 1/7完了
  - ✅ game-master-session.spec.ts リファクタリング
  - ⬜ session-gm.spec.ts リファクタリング
  - ⬜ user-management.spec.ts リファクタリング
  - ⬜ session.spec.ts APIクライアント適用
  - ⬜ scenario-*.spec.ts 共通化とフィクスチャー適用
  - ⬜ user-stock.spec.ts APIクライアント適用
  - ⬜ その他テストファイル移行

- **フェーズ3**: ⬜ 0/3完了
- **フェーズ4**: ⬜ 0/2完了

**総進捗**: 4/15タスク完了 (27%)

---

**このTODOリストを基に、段階的な改善作業を開始してください。**