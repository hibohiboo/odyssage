# Phase 2実装 MVP制約明確化指示書

## 📋 基本情報

**発行者**: プロジェクトリーダー  
**対象者**: 実装担当者  
**発行日**: 2025年8月18日  
**目的**: 設計担当レビューによるMVP制約範囲の明確化  
**参照文書**: `phase2_implementation_instructions_20250817.md`  

---

## 🎯 MVP制約の明確化

設計担当からの指摘により、Phase 2実装でのMVP制約範囲を明確化いたします。

### ✅ **設計担当からの評価**
- **整合率**: 95% (高度な整合性確保)
- **MVP制約遵守**: 100%整合
- **Event概念実装**: 100%整合

### ⚠️ **明確化が必要な項目**
1. **API連携方針**: モックAPI実装での代替
2. **エラーハンドリング範囲**: MVP範囲内のシンプル処理

---

## 🔧 API実装方針の明確化

### 📋 **正しいMVP実装方針**

#### 1. SceneLoader実装
```typescript
// ❌ 元の指示（誤解を招く表現）
// - APIからSceneデータ取得・キャッシュ機能

// ✅ 正しいMVP実装
export class SceneLoader {
  // モックJSONデータ + LocalStorage実装
  async loadScene(sceneId: string): Promise<Scene> {
    // 1. LocalStorageから確認
    // 2. なければモックJSONデータから取得
    // 3. LocalStorageにキャッシュ
  }
  
  async restoreSession(sessionId: string): Promise<SessionState> {
    // LocalStorageベースのセッション復元のみ
  }
}
```

#### 2. Auto-save Service実装
```typescript
// ❌ 元の指示（誤解を招く表現）
// - バックエンドAPI連携・自動保存機能

// ✅ 正しいMVP実装
export class AutoSaveService {
  // LocalStorageベースの自動保存のみ
  async saveSession(sessionState: SessionState): Promise<void> {
    // LocalStorageへの保存のみ
    // ネットワークAPI呼び出しなし
  }
  
  setupAutoSave(interval: number): void {
    // LocalStorage定期保存の設定
  }
}
```

### 🚨 **API実装での注意事項**
```markdown
❌ 実装禁止（MVP制約）:
- バックエンドAPIへのHTTP通信
- ネットワーク接続・認証処理
- 外部サーバーとの通信機能
- 複雑なキャッシュ戦略

✅ MVP範囲内実装:
- LocalStorageベースの永続化
- モックJSONデータの活用
- 基本的なデータ取得・保存
- シンプルなセッション管理
```

---

## 🛠️ エラーハンドリング範囲の明確化

### 📋 **正しいMVP実装方針**

#### 1. 基本エラー処理のみ
```typescript
// ❌ 元の指示（過度な実装）
// - ネットワークエラー対応・リトライ機能
// - エラーハンドリング・フォールバック機能

// ✅ 正しいMVP実装
const handleError = (error: Error) => {
  // シンプルなエラー表示のみ
  showErrorMessage("エラーが発生しました");
  console.error(error);
  
  // 基本的な再試行ボタンのみ
  showRetryButton();
};
```

#### 2. MVP範囲内のエラー対応
```typescript
// LocalStorage操作でのエラー
try {
  const data = localStorage.getItem(key);
} catch (error) {
  // シンプルな代替処理
  return defaultData;
}

// JSON解析エラー
try {
  const parsed = JSON.parse(data);
} catch (error) {
  // 基本的なフォールバック
  return initialState;
}
```

### 🚨 **エラーハンドリング制約**
```markdown
❌ 実装禁止（MVP制約）:
- 複雑なリトライ戦略・指数バックオフ
- ネットワークエラーの詳細分析
- 高度なエラー回復機能
- ユーザー向け詳細エラー説明

✅ MVP範囲内実装:
- 「エラーが発生しました」基本表示
- シンプルな再試行ボタン
- console.errorでのデバッグ情報
- 基本的なフォールバック処理
```

---

## 📋 修正された実装計画

### 🎯 Priority 1: PlaySessionContainer実装 (0.5日)
```typescript
export function PlaySessionContainer() {
  const eventEngine = useEventEngine({
    // LocalStorageベースの状態管理
    persistTo: 'localStorage'
  });
  
  // 基本的なエラー処理
  if (eventEngine.error) {
    return <ErrorMessage message="エラーが発生しました" />;
  }
  
  return <PlaySessionView {...propsMapping} />;
}
```

### 🎯 Priority 2: SceneLoader実装 (1日)
```typescript
export class SceneLoader {
  // モックJSONベースの実装
  async loadScene(sceneId: string): Promise<Scene> {
    try {
      // LocalStorage確認 → モックJSON → LocalStorage保存
      return await this.loadFromMockData(sceneId);
    } catch (error) {
      // シンプルなエラー処理
      throw new Error("Sceneデータの取得に失敗しました");
    }
  }
}
```

### 🎯 Priority 3: Auto-save Service実装 (0.5日)
```typescript
export class AutoSaveService {
  // LocalStorageベースの実装
  async saveSession(sessionState: SessionState): Promise<void> {
    try {
      localStorage.setItem(`session_${sessionId}`, JSON.stringify(sessionState));
    } catch (error) {
      // シンプルなエラー処理
      console.error('セッション保存失敗:', error);
    }
  }
}
```

---

## 🎯 設計担当との協働確認事項

### 📞 **実装開始時の確認内容**

#### 1. API実装方針の最終確認
```markdown
✅ SceneLoader: モックJSON + localStorage実装確認
✅ AutoSaveService: localStorageベース自動保存確認
✅ バックエンドAPI呼び出しなしの確認
```

#### 2. MVP制約の再共有
```markdown
✅ 実装禁止機能リストの再確認
✅ エラーハンドリング範囲の合意
✅ Event概念実装優先度の確認
```

#### 3. 品質基準の継続確認
```markdown
✅ TypeScript型安全性の継続
✅ packages/ui品質基準の維持
✅ Container Pattern等アーキテクチャ原則
```

---

## 🚨 重要な実装制約（再確認）

### MVP制約遵守の徹底
```markdown
❌ 絶対実装禁止:
- バックエンドAPI・ネットワーク通信
- 複雑なエラー処理・リトライ戦略
- フィルタリング・検索・ソート機能
- 参加者数表示・複雑な参加状態管理
- 再プレイ機能・キーボード操作
- タイプライター効果・派手な演出
```

### 品質基準の継続
```markdown
✅ 継続必須:
- TypeScript型安全性・完全な型チェック
- ESLint・Prettier・コード品質基準
- 責務分離・Container Pattern
- Phase 1で確立した品質レベル維持
```

---

## 📅 修正されたスケジュール

### Day 1: PlaySessionContainer + SceneLoader (LocalStorage版)
```
AM: PlaySessionContainer実装・LocalStorageベース状態管理
PM: SceneLoader実装・モックJSONデータ活用・LocalStorage保存
```

### Day 2: SceneLoader完成 + Auto-save Service (LocalStorage版)
```
AM: SceneLoader完成・基本エラー処理実装
PM: Auto-save Service (LocalStorageベース)・統合テスト・品質確認
```

---

## 🤝 協働・サポート体制（継続）

### リーダーからの支援
- **MVP制約確認**: LocalStorage実装・エラー処理範囲の相談対応
- **技術課題対応**: モックデータ活用・基本実装の支援
- **品質基準確認**: TypeScript・アーキテクチャ相談

### 設計担当との協働
- **初回MTG実施**: API実装方針・MVP制約の最終確認
- **日次品質確認**: MVP制約遵守・設計整合性の監視
- **Event概念解説**: data-design.md活用した技術相談

---

## 📋 修正された完了基準

### Phase 2完了チェックリスト
- [ ] PlaySessionContainer: useEventEngine統合・LocalStorageベース状態管理
- [ ] SceneLoader: モックJSONデータ活用・LocalStorage保存・基本エラー処理
- [ ] Auto-save Service: LocalStorageベース自動保存・シンプルエラー処理
- [ ] 静的解析: TypeScript・ESLint・Prettier全て通過
- [ ] MVP制約確認: バックエンドAPI呼び出しなし・複雑エラー処理なし確認
- [ ] 統合動作: PlaySessionView・Event処理・LocalStorage状態管理確認
- [ ] BDDテスト準備: テスト担当への引継ぎ・動作確認体制準備

---

## 🎯 成功への再確認

### 設計担当からの確信
**「Phase 1の卓越した成果と、リーダー様の一貫性ある指示により、Phase 2の成功は確実です。」**

### MVP制約遵守による確実な成功
- **LocalStorageベース実装**: 確実な実装・テスト・動作確認可能
- **シンプルエラー処理**: MVP範囲内での確実な品質確保
- **Phase 1技術基盤**: 90%効率化の活用による高速実装

---

## 📞 連絡・相談（継続）

### 即座連絡が必要な場合
- **MVP制約確認**: LocalStorage実装・エラー処理範囲の確認
- **技術課題**: モックデータ活用・基本実装での課題
- **設計整合性**: Event概念・data-design.md整合性の相談

### 設計担当との初回MTG
**実装開始前に必須**: API実装方針・MVP制約の最終確認・質疑応答

---

**🚀 MVP制約遵守による確実なPhase 2成功を期待しています！**

#mvp-constraints #localstorage-implementation #simple-error-handling #design-alignment #phase2-success