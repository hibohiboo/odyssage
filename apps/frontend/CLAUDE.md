# apps/frontend

## 役割
ユーザーが操作するWebアプリケーションのフロントエンドです。シナリオ作成・セッション管理のユーザーインターフェースを提供します。

## 責務
- **ユーザーインターフェース**: シナリオ・セッション管理のUI
- **状態管理**: アプリケーション状態の管理
- **API通信**: バックエンドAPIとの通信
- **認証**: Firebase Authenticationによるユーザー認証

## 構成（Feature-Sliced Design）
```
src/
├── app/               # アプリケーション設定
│   ├── App.tsx
│   └── Router.tsx
├── entities/          # ドメインエンティティ
├── features/          # 機能別実装
├── pages/             # ページコンポーネント
├── shared/            # 共通リソース
└── styles/            # スタイル
```

## 技術スタック
- **React 19**: UIライブラリ
- **TypeScript**: 型安全性
- **Vite**: ビルドツール・開発サーバー
- **Redux Toolkit**: 状態管理
- **SWR**: サーバー状態管理・データフェッチング
- **React Router v7**: ルーティング
- **Tailwind CSS v4**: スタイリング

## アーキテクチャパターン
- **Feature-Sliced Design**: 機能ベースのディレクトリ構成
- **Presentation/Container**: UIロジックとビジネスロジックの分離
- **Custom Hooks**: 再利用可能なロジックの抽象化

## 状態管理戦略
- **Redux Toolkit**: グローバルなアプリケーション状態
- **SWR**: サーバーデータのキャッシュ・同期
- **Local State**: コンポーネント固有の状態

## 依存関係
- **@odyssage/ui**: UIコンポーネントライブラリ
- **@odyssage/schema**: API型定義

## テスト戦略
- **Vitest**: 単体テスト・統合テスト
- **React Testing Library**: コンポーネントテスト
- **MSW**: APIモッキング

## 開発フロー
1. Feature-Sliced Designに従った設計
2. UIコンポーネントから実装開始
3. カスタムフックでロジック分離
4. SWRでAPIとの連携実装