# テストリスト - ドメインエンティティ

## 未実装
- [ ] Scene に Event を追加するテスト
- [ ] Event に Message を追加するテスト
- [ ] Message に選択肢を追加するテスト
- [ ] Scenario の階層構造検証テスト
- [ ] エンティティの更新時にupdatedAtが変更されるテスト
- [ ] 不正なデータでエンティティ作成が失敗するテスト

## 実装中
- 現在実装中のテストはありません

## 完了
- [x] Scenario エンティティの作成テスト
- [x] Scene エンティティの作成テスト
- [x] Event エンティティの作成テスト
- [x] Message エンティティの作成テスト
- [x] Scenario に Scene を追加するテスト

## 備考
- Scenarioを集約ルートとした階層構造: Scenario > Scene > Event > Message
- 各エンティティは不変性を保ちつつ、適切な更新メソッドを提供
- 選択肢（Choice）はMessageエンティティ内で管理し、次のEventへの参照を持つ