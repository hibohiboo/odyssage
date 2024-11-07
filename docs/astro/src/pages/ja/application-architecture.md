---
title: 技術選定
description: アプリケーションの設計
layout: ../../layouts/MainLayout.astro
---

# 概要

下記サイトの１章を参考に、本アプリケーションの設計を検討した。

[React Application Architecture for Production〜これ一冊で全てが網羅〜](https://qiita.com/taisei-13046/items/64f764ad2d2caaf4d7d4)

# アプリケーション設計

## Project の構造

下記を参考に検討している。 FSD を Next 用に調整する。

| 手法                                                                                           | 特徴                                     
| ---------------------------------------------------------------------------------------------- | ---------------------------------------- |
| [Feature Sliced Design](https://zenn.dev/kyuki/articles/d736b0957e6336)                        | フロントエンド向けの階層構造             |
| [Bulletproof-react](https://zenn.dev/ukkyon/articles/03893da1dbf825)                           | 「特化」と「汎化」を意識した直観的な構造 |
| [domain-driven design](https://zenn.dev/yamachan0625/books/ddd-hands-on/viewer/chapter1_intro) | 複雑な業務要件に立ち向かう構造           |

## State の管理

| 要件                                     | 選択肢                         | 採用 |
| ---------------------------------------- | ------------------------------ | ---- |
| State が頻繁に更新される                 | atom-based (ex. Recoil, Jotai) |
| 異なる多くの State を Component 間で共有 | redux(ex. redux-toolkit)       |    |
| 特別な要件がない                         | Zustand,React Context          | 〇 

今回のアプリケーションではStateが頻繁に更新などの要件がない。 

| 状態         | 説明                                                         | 管理     |
| ------------ | ------------------------------------------------------------ | -------- |
| プレイヤー入力フォーム | メッセージを投稿するフォーム                                   | useState |
| シナリオ作成フォーム | シナリオ情報を投稿するフォーム                                   | useState |

## Styling はどのように行う？

build 時の CSS 解決が必要かどうかについて下記の観点で検討する。

- 頻繁な再レンダリング
- パフォーマンスの重要性

build 時の CSS 解決が必要な場合は Tailwind や vanilla css が選択肢となる。  
メディアクエリを簡単に使いたいため、Tailwindを採用した。


## レンダリング戦略

高いパフォーマンスと SEO が必要な場合は`Server-side rendering`(SSR)が求められる。

今回は一般公開用ではなく、SEO を気にする必要もないため`Client-side rendering`(CSR)を採用する。

# Routing

`react-router-dom`を採用。[*](https://reactrouter.com/en/main/start/overview)

Reactの最新機能を利用する要件がまだ存在しないため。

## ページごとに最適化したレンダリング戦略
参考先では下記のように分けている。

- 誰もが閲覧可能なページ ... SEOを意識
  - Server-side rendering（SSR）
- 管理者用のページ ... サーバ側の負荷軽減
  - Client-side rendering（CSR）

本アプリケーションではSEOを意識しないため、全ページ `CSR` を採用した。

# テスト設計

テストに利用するライブラリは利用者の多さから下記とした。

| テスト種別               | スコープ                                                                             | ライブラリ                 |
| ------------------------ | ------------------------------------------------------------------------------------ | -------------------------- |
| モジュール単体テスト     | 他のモジュールに依存しないテスト                                                     | Vitest                       |
| コンポーネント結合テスト | 複数モジュールを組み合わせて実装されたコンポーネントを対象とするテスト               | Vitest,React Testing Library |
| E2E テスト               | アプリケーション全体のテスト。正常系のケースをバックエンドとの通信を含めてテストする | Playwright                          |
