# テストリスト - Neo4j グラフデータベース

## 未実装
- [ ] シナリオ全体構造の取得クエリテスト
- [ ] 特定パスでの物語進行クエリテスト
- [ ] 分岐・合流構造の検証テスト
- [ ] ノード削除時のリレーション整合性テスト
- [ ] 循環参照の検出・防止テスト
- [ ] 複数シナリオ間の独立性確保テスト

## 実装中
- 現在実装中のテストはありません

## 完了
- [x] Neo4j接続の確立テスト
- [x] シナリオノードの作成テスト
- [x] シーンノードの作成テスト
- [x] イベントノードの作成テスト
- [x] メッセージノードの作成テスト
- [x] シナリオ→シーンのリレーション作成テスト
- [x] シーン→イベントのリレーション作成テスト
- [x] イベント→メッセージのリレーション作成テスト
- [x] メッセージ間の選択肢リレーション作成テスト

## 備考
### ノード設計
- **Scenario**: プロパティ（id, title, overview, userId, visibility）
- **Scene**: プロパティ（id, title, description, order, scenarioId）
- **Event**: プロパティ（id, title, description, order, sceneId）
- **Message**: プロパティ（id, text, order, eventId）

### リレーション設計
- **HAS_SCENE**: Scenario → Scene
- **HAS_EVENT**: Scene → Event  
- **HAS_MESSAGE**: Event → Message
- **CHOICE**: Message → Event（選択肢による分岐）
- **NEXT**: Message → Message（順次進行）

### クエリパターン
- 階層構造の全取得
- 特定ノードからの到達可能ノード検索
- 最短・最長パス検索
- 分岐数・選択肢数の集計