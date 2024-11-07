---
title: Vercel 設定
description: Vercelの設定
layout: ../../../../layouts/MainLayout.astro
---

# Vercel 設定

## npm install コマンドの変更

`@storybook/nextjs: ^8.3.6`と`next: 15.0.1`の間で不整合が起きており、`npm install`でエラーとなる。
一時的な不整合のため、`npm install --force`で暫定回避を行う。

The setting present under Project → Settings → General → Build & Development Settings.

![](/odyssage/images/settings/vercel-settings-1.png)
![](/odyssage/images/settings/vercel-settings-2.png)

## ビルドに使用する npm のバージョンをローカルと一致させる
### 実験的機能の許可
vercel.jsonに下記を追記

```diff
{
  "ignoreCommand": "bash bin/ignore-build-step.sh",
+  "env": {
+    "ENABLE_EXPERIMENTAL_COREPACK": "1"
+  }
}
```

### npm の バージョンを指定

package.jsonに下記を追加

```diff
{
  "name": "odyssage",
  "version": "0.9.5",
+  "packageManager": "npm@10.9.0"
}
```

## 実行環境のnodeバージョンを明示

### プロジェクト設定から

Settings > General > Node.js Version

![](/odyssage/images/settings/vercel-settings-4.png)

### package.jsonから
プロジェクト設定よりも優先される。
プロジェクト設定と異なっているとビルド時に警告が出力される。


```diff
{
+  "engines": {
+    "node": "20.x"
+  }
}
