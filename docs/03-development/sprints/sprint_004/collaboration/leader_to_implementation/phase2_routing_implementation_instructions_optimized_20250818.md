# Phase 2ルーティング実装指示書

## 📋 基本情報

**対象**: 実装担当  
**日時**: 2025年8月18日  
**目的**: Phase 2ルーティング実装完了・動作確認

---

## 🎯 **実装目標**

### **完了基準**
```markdown
✅ PlaySessionContainerへの直接URLアクセス成功
✅ sessionId・sceneIdパラメータの正常取得・処理
✅ useEventEngine統合・Event処理の正常動作
✅ LocalStorage連携・セッション状態管理の確認
✅ 静的解析通過（TypeScript・ESLint）
```

### **現在状況**
```markdown
完了済み:
- PlaySessionContainer実装（95%）
- SceneLoader・AutoSaveService実装
- Valibot統合・型安全検証

残り作業:
- React Router v7統合・ルーティング設定
- 統合動作確認・品質チェック
```

---

## 📚 **設計文書参照**

### **Priority 1: ルーティング基本設計**
```markdown
📄 docs/02-architecture/player-context/architecture.md
📍 L196-258「ルーティング設計詳細（緊急追加）」
内容: Player文脈ルート定義・責務分離・MVP制約
```

### **Priority 2: データアクセス統合**
```markdown  
📄 docs/02-architecture/player-context/data-design.md
📍 L1122-1206「ルーティングパラメータとデータ統合設計」
内容: sessionId・sceneIdとデータモデル対応・LocalStorageキー戦略
```

### **Priority 3: PlaySession画面統合**
```markdown
📄 docs/02-architecture/player-context/screens/play-session.md  
📍 L328-403「ルーティング統合・画面遷移」
内容: PlaySessionContainer設計・パラメータ処理・エラーハンドリング
```

---

## 🔧 **実装指針**

### **基本ルート設定**
```typescript
// 基本的なルート設定例
const routes = [
  {
    path: "/player/session/:sessionId/play",
    element: <PlaySessionContainer />
  },
  {
    path: "/player/session/:sessionId/play/:sceneId", 
    element: <PlaySessionContainer />
  }
];
```

### **MVP制約範囲**
```markdown
✅ 実装対象:
- 基本ルーティング・パラメータ取得
- PlaySessionContainer統合
- useEventEngine連携
- LocalStorageデータアクセス
- シンプルエラーハンドリング

❌ 実装禁止:
- 複雑ルートガード・認証
- 高度エラー処理・リトライ
- バックエンドAPI連携
- パフォーマンス最適化
```

---

## 📊 **確認項目**

### **動作確認**
```markdown
✅ URLアクセステスト:
- /player/session/test-session-001/play
- /player/session/test-session-001/play/scene-001

✅ 統合動作確認:
- パラメータ取得・PlaySessionContainer表示
- useEventEngine統合・Event処理動作
- LocalStorageアクセス・セッション復元
```

### **品質確認**
```markdown
✅ 静的解析:
- TypeScript型チェック通過
- ESLint全ルール通過
- Prettier適用確認

✅ アーキテクチャ:
- packages/ui分離維持
- Container Pattern適用
- 型安全性（Valibot統合）
```

---

## 🤝 **支援体制**

### **設計担当相談**
```markdown
✅ 即座相談推奨:
- 設計仕様・制約の詳細
- MVP制約範囲・除外機能
- アーキテクチャ整合性確認
```

### **リーダーサポート**
```markdown
✅ 調整・支援:
- 技術課題・実装判断
- 品質基準・完了基準
- スケジュール・優先度調整
```

---

## ⏰ **完了スケジュール**

### **実装手順**
```markdown
1. 設計文書確認・理解（30分）
2. React Router v7設定・統合（1-2時間）
3. PlaySessionContainer統合（1時間）
4. 動作確認・統合テスト（1時間）
5. 品質確認・静的解析（30分）
6. 完了報告・Phase 3準備（30分）

推定: 4-5時間
```

### **完了報告内容**
```markdown
✅ 実装完了・動作確認結果
✅ 品質確認・静的解析結果  
✅ 発見課題・改善提案
✅ Phase 3移行準備状況
```

---

## 📞 **緊急連絡**

### **即座連絡事項**
```markdown
🚨 緊急対応:
- 技術実装困難・設計矛盾
- 品質基準未達・解析エラー
- スケジュール遅延・完了リスク
```

---

## 📋 **実装チェックリスト**

### **即座実行**
```markdown
1. 設計文書確認: Priority 1-3読了
2. 環境・制約確認: MVP範囲・禁止事項把握
3. 実装開始: React Router v7基本実装
```

### **実装中確認**
```markdown
- sessionId・sceneIdパラメータ取得確認
- LocalStorageアクセス・データ統合確認
- エラーハンドリング基本機能確認
```

### **完了時アクション**
```markdown
1. 品質チェック: 動作・TypeScript・ESLint確認
2. 動作報告: 設計担当へ統合確認依頼
3. Phase 3準備: リーダーへ完了報告
```

---

**技術相談**: 設計仕様・制約→設計担当 / 実装手法・技術判断→実装担当専門領域

#phase2-routing #implementation-instructions #mvp-constraints #quality-assurance