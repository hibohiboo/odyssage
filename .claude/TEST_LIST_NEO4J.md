# テストリスト - Neo4j グラフデータベース

## 実装中

## 未実装

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
- [x] シナリオ全体構造の取得クエリテスト
- [x] プレイヤーパス追跡テスト
- [x] 利用可能な選択肢取得テスト
- [x] ストーリーパス検証テスト
- [x] 現在のプレイヤー位置取得テスト
- [x] 到達可能イベント検索テスト
- [x] プレイヤー選択履歴検索テスト

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