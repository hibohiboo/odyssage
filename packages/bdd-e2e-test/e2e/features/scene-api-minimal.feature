Feature: シーンAPI基本動作テスト（最小限）
  開発者として
  シーンGraphDB APIが基本的に動作することを確認したい
  それにより実装が正しく動作していることを保証するため

  Scenario: GraphDBシーンAPI基本動作確認
    Given GraphDBサービスが利用可能である
    When シーンAPIに作成リクエストを送信する
      | field      | value                                    |
      | title      | テストシーン                               |
      | overview   | APIテスト用のシーン                          |
      | scenarioId | 550e8400-e29b-41d4-a716-446655440000    |
      | order      | 1                                        |
    Then APIレスポンスが正常（200）である
    And レスポンスにシーン情報が含まれている
    And GraphDBにシーンデータが保存されている

  Scenario: シーン一覧取得API動作確認
    Given テスト用シナリオ「550e8400-e29b-41d4-a716-446655440000」が存在する
    When シーン一覧取得APIを呼び出す
    Then APIレスポンスが正常（200）である
    And レスポンスが配列形式である
    And シーンが存在する場合、適切な構造を持つ