<div><img src="./docs/astro/public/images/consept-art/top.png" /></div>

<div align="center">オデッサージュ</div>

---

# コンセプト

未知を辿る、非同期型ゲームブック風TRPG。
君だけの旅路を残す白い手帳。

# Odyssage
[Odyssage](https://odyssage.pages.dev/)  
[Odyssage テーマソング](https://suno.com/song/79917a5e-040d-4378-a1f3-3023fd161697)  
[開発者ドキュメント](https://hibohiboo.github.io/odyssage/ja/introduction/)

# 開発環境

## ワークスペース

[Bun workspace で始めるモノレポ生活](https://azukiazusa.dev/blog/bun-workspace/)

## 最初にやること

```
npm install
npm run init
```

## フォルダ構成

```
odysseyage/
├── apps/
│   ├── frontend/            # フロントエンドアプリケーション
│   │   ├── src/
│   │   │   ├── app/         # グローバルなアプリケーション設定（ルート、状態管理など）
│   │   │   ├── entities/    # ドメインエンティティ（Character, Scenarioなど）
│   │   │   ├── features/    # ドメイン機能（キャラクター管理、シナリオ管理など）
│   │   │   ├── pages/       # ページコンポーネント
│   │   │   ├── shared/      # 共通コンポーネント、ユーティリティ
│   │   │   └── widgets/     # UIウィジェット（ヘッダー、フッターなど）
│   │   └── tests/           # テスト関連（ユニットテスト、E2Eテスト）
├── packages/
│   ├── core/                # 共通のコアロジック（DDDのドメイン層に相当）
│   │   ├── character/       # キャラクター文脈
│   │   ├── scenario/        # シナリオ文脈
│   │   ├── session/         # セッション文脈
│   │   └── party/           # パーティ文脈
│   ├── ui/                  # UIコンポーネントライブラリ
│   └── utils/               # 共通ユーティリティ
├── docs/                    # 設計ドキュメント
└── package.json
```

### フォルダ構成のポイント

1.  **モノレポ構成**:
    *   `apps/` と `packages/` でプロジェクトを分離し、再利用性を高める。
    *   `core/` には、各文脈のドメインロジックが入る。
2.  **DDDとFSDの融合**:
    *   `entities/` や `features/` など、FSDのフォルダ構成を採用してドメイン層を分かりやすく配置。
    *   ドメイン層は `core/` 内の各パッケージに分け、DDDの概念に沿って設計。
3.  **テスト**:
    *   ユニットテスト、統合テスト、E2Eテストを `tests/` 内にまとめる。
4.  **設計ドキュメント**:
    *   `docs/` フォルダに、これまでのDDD設計資料をまとめて配置。
 

# デプロイ

cloudflareを使ってデプロイ

# ブランチ

ブランチ|説明
--|--
main|https://odyssage.pages.dev/ にデプロイ
develop|https://develop.odyssage.pages.dev/ にデプロイ。github-pagesの更新
docs|デプロイを行わず、github-pagesの更新のみ
id/*/*|開発用Featureブランチ
