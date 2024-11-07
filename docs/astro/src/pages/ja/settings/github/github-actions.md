---
title: GitHub Actions 設定
description: GitHub Actions のための設定
layout: ../../../../layouts/MainLayout.astro
---

# リリースノート用設定

github action で リリースノート をデプロイするときの、git 側での追加設定。 [issues](https://github.com/hkj-hub/odyssage/issues/41)  

actionsの設定は下記参照。

- `.github/release.yml`           ... リリースノート自動設定用の情報を記載
- `.github/workflows/label.yml`   ... プルリク作成時のラベル付与 Action
- `.github/workflows/release.yml` ... プルリクマージ時のリリースノート作成 Action

## タグやリリースノートを書き込むための設定箇所

Settings > Actions > General > Workflow permissions

Read and write permissionを追加

![](/odyssage/images/settings/github-settings-1.png)

## プルリクに設定する用のラベルの作成

![](/odyssage/images/settings/github-settings-2.png)


