Feature: シナリオGraphDB連携
  ユーザーとして
  シナリオをRDBとGraphDBの両方に保存したい
  それによりシナリオデータの構造情報と関係性を管理できるようにするため

  Background:
    Given アプリが起動している

  Scenario: GraphDB連携でシナリオが正常に作成される
    When ユーザーが「 "シナリオ管理" 」リンクをクリックする
    And ユーザーが「 "新規シナリオ作成" 」リンクをクリックする
    And "GraphDB連携テスト" という名前でシナリオを作成する
    And 概要を "GraphDBとRDBの両方に保存されるテストシナリオ" と設定する
    And 「保存する」ボタンをクリックする
    Then 作成したシナリオ"GraphDB連携テスト"がシナリオ一覧に表示される
    And GraphDBにシナリオデータが保存されている

  Scenario: GraphDB障害時でもRDBにシナリオが作成される
    Given GraphDBサービスが停止している
    When ユーザーが「 "シナリオ管理" 」リンクをクリックする
    And ユーザーが「 "新規シナリオ作成" 」リンクをクリックする
    And "GraphDB障害テスト" という名前でシナリオを作成する
    And 概要を "GraphDB障害時でもRDBには保存されるテストシナリオ" と設定する
    And 「保存する」ボタンをクリックする
    Then 作成したシナリオ"GraphDB障害テスト"がシナリオ一覧に表示される
    And GraphDBサービスを復旧する

  Scenario: 既存シナリオをGraphDBに同期する
    Given 公開シナリオ"GraphDB同期テスト"が存在する
    When シナリオ一覧からシナリオ"GraphDB同期テスト"の編集画面を開く
    And 概要を "GraphDBに同期されるように更新されたシナリオ" と変更する
    And 「保存する」ボタンをクリックする
    Then シナリオ"GraphDB同期テスト"が更新される
    And GraphDBのシナリオデータが更新されている