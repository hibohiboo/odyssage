# 実装担当者からレビュアーへのレビュー依頼ガイドライン

## 概要
Sprint 4 Phase 1 Component実装において、実装担当者としてレビュアーに対してどのような観点でレビューを実施してほしいかを明確にする。効果的なレビューによる品質向上とプロジェクト成功を目指す。

**作成日**: 2025年8月17日  
**対象**: Sprint 4 レビュアー  
**実装範囲**: PlaySessionView Component群、Event処理エンジン

---

## 🎯 レビューの主要観点

### 1. **アーキテクチャ設計の妥当性**

#### チェックポイント
- [ ] **責務分離**: packages/ui と apps/frontend の責務が適切に分離されているか
- [ ] **Single Responsibility**: 各コンポーネントが単一の責任を持っているか
- [ ] **依存関係**: コンポーネント間の依存が適切な方向か（逆依存していないか）
- [ ] **拡張性**: 新しいEvent種別の追加が容易な設計か

#### レビュー例
```typescript
// ✅ Good: UI層での純粋なプレゼンテーション
export function PlaySessionView(props: PlaySessionViewProps) {
  // 状態管理なし、propsに依存

// ❌ Bad: UI層での状態管理
export function PlaySessionView() {
  const [state, setState] = useState(); // apps/frontendで管理すべき
```

### 2. **重複コードの排除**

#### レビュー重点項目
- [ ] **DRY原則**: 同じロジック・UI構造が複数箇所に存在していないか
- [ ] **共通化可能性**: 共通コンポーネントとして抽出できるパターンがないか
- [ ] **命名の一貫性**: 類似機能のコンポーネントで命名規則が統一されているか

#### 実際の成功例
```typescript
// Before: 6ファイルで重複していた構造
<div className="space-y-4">
  <div className="prose prose-gray max-w-none">
    <p className="text-gray-800 leading-relaxed font-serif text-lg">{text}</p>
  </div>
</div>

// After: 共通コンポーネント化
<EventContentBase>
  <EventText text={content} />
</EventContentBase>
```

### 3. **TypeScript型安全性**

#### 必須チェック項目
- [ ] **型定義の完全性**: すべてのpropsとstateが適切に型定義されているか
- [ ] **Type Narrowing**: union typeの適切な絞り込みが実装されているか
- [ ] **null/undefined安全性**: Optional Chainingや適切なガードが実装されているか
- [ ] **型エクスポート**: 必要な型が適切にエクスポートされているか

#### レビュー観点
```typescript
// ✅ Good: 適切な型ガード
if (event.type === 'choice' && event.data.choices) {
  // TypeScriptが型を正しく推論

// ❌ Bad: 型アサーション濫用
const choices = (event.data as any).choices;
```

### 4. **コンポーネント設計品質**

#### Atomic Design遵守
- [ ] **Atoms**: 最小単位のコンポーネントが適切に分離されているか
- [ ] **Organisms**: 複合コンポーネントが適切な粒度で構成されているか
- [ ] **再利用性**: コンポーネントが他の文脈でも利用可能な設計か

#### プロパティ設計
- [ ] **Props最小主義**: 必要最小限のpropsのみが定義されているか
- [ ] **イベントハンドリング**: コールバック関数が適切に抽象化されているか
- [ ] **デフォルト値**: 適切なデフォルト値が設定されているか

### 5. **パフォーマンス考慮**

#### チェック項目
- [ ] **不要な再レンダリング**: useMemo, useCallbackが適切に使用されているか
- [ ] **条件分岐の効率性**: 早期returnが適切に使用されているか
- [ ] **バンドルサイズ**: 不要なライブラリがインポートされていないか

---

## 🔍 特に注意してほしい実装パターン

### 1. **State管理の境界**

```typescript
// ✅ 推奨: packages/ui - 純粋なUI
export function PlaySessionView(props: PlaySessionViewProps) {
  // propsから全て受け取り、状態管理なし

// ✅ 推奨: apps/frontend - 状態管理
export function PlaySessionContainer() {
  const [state, setState] = useState();
  return <PlaySessionView {...props} />;
```

### 2. **Event処理の抽象化**

```typescript
// ✅ Good: 型安全なEvent処理
switch (event.type) {
  case 'choice': return <ChoiceEventContent />;
  case 'narrative': return <NarrativeEventContent />;
  default: return <DefaultEventContent />;
}

// ❌ Bad: 分岐がない万能コンポーネント
function UniversalEventContent({ event }) {
  // すべてのEvent typeを1つのコンポーネントで処理
```

### 3. **エラーハンドリングの一貫性**

```typescript
// ✅ Good: 明確なエラー状態管理
if (error) {
  return <ErrorView error={error} />;
}

// ❌ Bad: エラーの無視や不適切な処理
try {
  // 処理
} catch (e) {
  console.log(e); // エラーを隠蔽
}
```

---

## 📋 レビューチェックリスト

### コード品質
- [ ] ESLint, Prettier設定に準拠しているか
- [ ] 改行コードがLFに統一されているか
- [ ] インポート順序が規約に従っているか
- [ ] 未使用のimportやvarableがないか
- [ ] 複雑度がESLint設定値以下か

### 文書化
- [ ] コンポーネントの役割がJSDocで明記されているか
- [ ] 複雑な処理にコメントが適切に記載されているか
- [ ] Storybookのstoryが網羅的に作成されているか

### テスタビリティ
- [ ] コンポーネントが単体テスト可能な設計か
- [ ] 依存関係がMock化しやすい構造か
- [ ] propsの境界が明確で、テストデータが作成しやすいか

---

## 🚨 特に厳しくレビューしてほしい項目

### 1. **技術負債の芽**
- 一時的な回避策（TODO、FIXME、HACKコメント）がないか
- 「とりあえず動く」レベルの実装が混入していないか
- 将来的な変更で影響範囲が拡大しそうな結合度の高い実装がないか

### 2. **セキュリティ観点**
- XSS脆弱性につながるdangerouslySetInnerHTMLの不適切な使用がないか
- ユーザー入力の適切なエスケープ処理がされているか
- 機密情報（API key等）がハードコードされていないか

### 3. **アクセシビリティ**
- 適切なARIA属性が設定されているか
- キーボード操作に対応しているか
- スクリーンリーダー対応が考慮されているか

---

## 💡 レビューで発見してほしい改善点

### 1. **命名の改善提案**
```typescript
// より良い命名の提案を期待
const handleClick = () => {}; // ❌ 汎用的すぎる
const handleChoiceSelection = () => {}; // ✅ 具体的で分かりやすい
```

### 2. **リファクタリング機会の指摘**
- 長すぎる関数の分割提案
- 複雑すぎる条件分岐の簡素化提案
- より適切なデザインパターンの適用提案

### 3. **パフォーマンス改善の提案**
- 不要な計算の最適化
- レンダリング効率の改善
- バンドルサイズの最適化

---

## 🎯 期待するレビューアウトプット

### 1. **具体的な改修提案**
```markdown
## 改修提案: EventDisplay.tsx L25-30

### 現在のコード
```typescript
if (event.type === 'choice') {
  return <ChoiceEventContent />;
} else if (event.type === 'narrative') {
  return <NarrativeEventContent />;
}
```

### 提案
switch文使用で可読性向上
```typescript
switch (event.type) {
  case 'choice': return <ChoiceEventContent />;
  case 'narrative': return <NarrativeEventContent />;
  default: return <DefaultEventContent />;
}
```
```

### 2. **設計観点からのフィードバック**
- アーキテクチャの改善提案
- 将来的な拡張性への懸念点
- 他のプロジェクトでの成功パターンの共有

### 3. **品質向上のための具体的アクション**
- 追加すべきテストケース
- 改善すべきドキュメント
- リファクタリングの優先順位

---

## 🤝 レビュアーとの協力方針

### コミュニケーション
- [ ] **質問歓迎**: 設計意図が不明な箇所は遠慮なく質問してください
- [ ] **代替案の議論**: より良い実装方法があれば積極的に提案してください
- [ ] **学習機会**: レビューを通じて双方の技術向上を目指したい

### レビュー効率化
- [ ] **重要度の明示**: Must fix / Should fix / Nice to have の明示をお願いします
- [ ] **修正方針の確認**: 大幅な修正が必要な場合は事前に方針を相談したい
- [ ] **段階的改善**: 完璧を求めすぎず、継続的改善の視点を重視したい

---

## 📚 参考資料

### プロジェクト固有ドキュメント
- [アーキテクチャ分離指針](../architecture/folder_responsibilities_and_development_guidelines_20250817.md)
- [Storybookリファクタリング学習記録](../lessons/storybook_refactoring_lessons_20250817.md)

### 技術基準
- [ESLint設定](.eslintrc.js)
- [TypeScript設定](tsconfig.json)
- [Storybookガイドライン](.storybook/main.ts)

---

このガイドラインに基づく建設的なレビューにより、高品質で保守性の高いコンポーネント群の実現を目指します。レビューを通じてプロジェクト全体の技術レベル向上に貢献していただければと思います。