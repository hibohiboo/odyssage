# テストリスト - バックエンドAPI

## 未実装
### シナリオ構造CRUD API
- [ ] POST /scenarios/{id}/structure - シナリオ構造全体の作成テスト
- [ ] GET /scenarios/{id}/structure - シナリオ構造全体の取得テスト
- [ ] PUT /scenarios/{id}/structure - シナリオ構造全体の更新テスト
- [ ] DELETE /scenarios/{id}/structure - シナリオ構造全体の削除テスト

### シーン操作API
- [ ] POST /scenarios/{id}/scenes - シーンの追加テスト
- [ ] GET /scenarios/{id}/scenes - シーン一覧取得テスト
- [ ] PUT /scenarios/{id}/scenes/{sceneId} - シーン更新テスト
- [ ] DELETE /scenarios/{id}/scenes/{sceneId} - シーン削除テスト
- [ ] PUT /scenarios/{id}/scenes/{sceneId}/order - シーン順序変更テスト

### イベント操作API
- [ ] POST /scenarios/{id}/scenes/{sceneId}/events - イベント追加テスト
- [ ] GET /scenarios/{id}/scenes/{sceneId}/events - イベント一覧取得テスト
- [ ] PUT /scenarios/{id}/scenes/{sceneId}/events/{eventId} - イベント更新テスト
- [ ] DELETE /scenarios/{id}/scenes/{sceneId}/events/{eventId} - イベント削除テスト

### メッセージ操作API
- [ ] POST /scenarios/{id}/events/{eventId}/messages - メッセージ追加テスト
- [ ] GET /scenarios/{id}/events/{eventId}/messages - メッセージ一覧取得テスト
- [ ] PUT /scenarios/{id}/events/{eventId}/messages/{messageId} - メッセージ更新テスト
- [ ] DELETE /scenarios/{id}/events/{eventId}/messages/{messageId} - メッセージ削除テスト

### 選択肢・分岐API
- [ ] POST /scenarios/{id}/messages/{messageId}/choices - 選択肢追加テスト
- [ ] PUT /scenarios/{id}/messages/{messageId}/choices/{choiceId} - 選択肢更新テスト
- [ ] DELETE /scenarios/{id}/messages/{messageId}/choices/{choiceId} - 選択肢削除テスト

### フロー操作API
- [ ] GET /scenarios/{id}/flow - シナリオフロー取得テスト
- [ ] POST /scenarios/{id}/flow/validate - フロー整合性検証テスト
- [ ] GET /scenarios/{id}/paths - 利用可能パス一覧取得テスト

### エラーハンドリング
- [ ] 存在しないシナリオIDでのアクセステスト
- [ ] 権限のないユーザーでのアクセステスト
- [ ] 不正なデータ形式での作成・更新テスト
- [ ] 循環参照作成時のエラーテスト
- [ ] リレーション整合性違反時のエラーテスト

## 実装中
- 現在実装中のテストはありません

## 完了
- テストはまだありません

## 備考
### 認証・認可
- Firebase Auth JWTトークンによる認証
- シナリオ作成者のみが編集可能
- 公開シナリオは読み取り専用でアクセス可能

### データ整合性
- PostgreSQLとNeo4jの二重管理
- トランザクション境界の適切な設定
- エラー時のロールバック処理

### パフォーマンス
- 大規模シナリオでの応答性能
- 並行アクセス時の整合性
- キャッシュ戦略の適用