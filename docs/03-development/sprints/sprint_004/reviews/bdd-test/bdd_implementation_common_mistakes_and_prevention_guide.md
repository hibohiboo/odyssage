# BDD実装共通ミス・防止ガイド

**作成日**: 2025-08-20  
**作成者**: テスト担当（Claude Code）  
**対象**: 次スプリント担当者・開発チーム全体  
**目的**: BDD実装における反復発生ミスの防止・品質向上

---

## 🚨 **繰り返し発生した重大ミス**

### **ミス1: Cucumberパラメータマッチング不備**

#### **問題内容**
```gherkin
# ❌ 間違い - Cucumberが{string}パラメータを認識しない
Given('現在のシーンが「{string}」である', async function (sceneName: string) {
  // 実行されない - undefinedエラー
});
```

#### **根本原因**
- **技術理解不足**: Cucumberの日本語正規表現マッチング特性の理解不足
- **テスト不備**: step definition作成後の即座動作確認を省略
- **パターン認識不足**: 同様の問題を複数回繰り返し

#### **正しい実装**
```typescript
// ✅ 正解 - リテラル文字列で完全一致
Given('現在のシーンが「第1章：森の入り口」である', async function () {
  await expect(this.page.locator('body')).toContainText('第1章：森の入り口');
});

// または、英語引用符を使用
Given('現在のシーンが {string} である', async function (sceneName: string) {
  await expect(this.page.locator('body')).toContainText(sceneName);
});
```

---

### **ミス2: data-testid過剰使用・不適切使用**

#### **問題内容**
```typescript
// ❌ 間違い - 不必要にdata-testid使用
Given('現在のシーンが「第1章：森の入り口」である', async function () {
  await expect(this.page.locator('[data-testid="scene-title"]')).toContainText(sceneName);
});
```

#### **根本原因**
- **使い分け理解不足**: data-testid vs テキストベース検索の適用場面混同
- **段階的実装方針無視**: 最小限実装原則を無視した過剰実装
- **保守性軽視**: 不要なdata-testid依存による脆弱性増加

#### **適切な使い分け**
```typescript
// ✅ data-testid適用場面: 構造的要素・一意識別が必要
await expect(this.page.locator('[data-testid="scene-background"]')).toBeVisible();

// ✅ テキストベース適用場面: 内容確認・表示テキスト検証
await expect(this.page.locator('body')).toContainText('第1章：森の入り口');

// ✅ CSS/構造ベース適用場面: 汎用的な要素確認
await expect(this.page.locator('div[class*="aspect-video"], img')).toBeVisible();
```

---

### **ミス3: Feature-Steps同期不備**

#### **問題内容**
- **Step定義後の動作確認省略**: 作成直後のBDD実行・エラー確認を怠る
- **incrementalテスト不実施**: 1stepずつの段階確認を省略
- **エラー解析不十分**: undefinedエラーの詳細原因分析を回避

#### **正しいプロセス**
```bash
# ✅ 正解プロセス
1. 単一step定義追加
2. 即座にBDD実行・エラー確認
3. 1つのstepが成功確認後、次のstep追加
4. 全step完了後に統合テスト
```

---

## 📋 **防止策チェックリスト**

### **Step定義作成時の必須確認事項**

#### **パラメータマッチング確認**
- [ ] 日本語引用符「」使用時は{string}パラメータ避ける
- [ ] 英語引用符""使用時のみ{string}パラメータ適用
- [ ] step定義作成直後にBDD実行・undefined確認

#### **セレクタ戦略確認**
- [ ] data-testid使用理由の明確化（構造的必要性）
- [ ] テキストベース検索可能性の優先検討
- [ ] 最小限実装方針との整合性確認

#### **段階的実装確認**
- [ ] 1step追加→BDD実行→成功確認の徹底
- [ ] 複数step同時追加の禁止
- [ ] エラー発生時の即座原因分析・修正

---

## 🎯 **品質向上のための実装方針**

### **data-testid使用判断基準**

#### **使用推奨場面**
```typescript
// ✅ 推奨: 一意識別が困難な構造的要素
[data-testid="scene-background"]     // 複数のdivから特定の背景要素
[data-testid="session-title"]       // ページ内の特定タイトル要素
[data-testid="continue-button"]     // 複数ボタンから特定の継続ボタン
```

#### **使用非推奨場面**
```typescript
// ❌ 非推奨: テキスト内容確認
body:has-text("第1章：森の入り口")    // ✅ テキストベースが適切

// ❌ 非推奨: 汎用的な要素確認  
div[class*="aspect-video"]           // ✅ CSS/構造ベースが適切

// ❌ 非推奨: 単純な存在確認
img, button                          // ✅ 要素セレクタが適切
```

### **エラー解析・デバッグ手順**

#### **Undefined Step Error対応**
```bash
1. エラーメッセージの正確な把握
2. step定義文字列と.featureファイルの完全一致確認
3. 日本語引用符・英語引用符の使い分け確認  
4. パラメータ{string}使用時の引用符種類確認
5. 1つずつstep定義削除・原因特定
```

#### **Timeout Error対応**
```bash
1. 要素が実際に表示されているかブラウザ確認
2. セレクタが正しく要素を特定できているか確認
3. data-testid実装状況の確認
4. 代替セレクタ（テキスト・CSS）での動作確認
5. 要素の表示タイミング・ローディング状態確認
```

---

## 🔄 **継続改善のための協働体制**

### **実装⇔テスト担当間連携強化**

#### **実装担当への依頼時**
```markdown
明確な要求仕様:
✅ 具体的なdata-testid名・実装箇所の指定
✅ 実装後の動作確認手順・確認観点の提示
✅ 段階的実装・削除範囲の明確化

継続フィードバック:
✅ 実装結果のBDD動作確認結果の共有
✅ 改善点・問題点の具体的指摘
✅ 次回実装時の優先事項・重点課題の伝達
```

#### **テスト担当側の改善**
```markdown
技術理解向上:
✅ Cucumber・Playwright技術仕様の継続学習
✅ 日本語BDD特有の制約・回避策の把握
✅ セレクタ戦略・パフォーマンス考慮の向上

プロセス改善:
✅ 段階的実装・テスト方針の徹底
✅ エラー解析・原因特定能力の向上
✅ 文書化・ナレッジ共有の継続実施
```

---

## ⚡ **緊急時対応ガイド**

### **BDD実行エラー時の迅速解決手順**

#### **Undefined Step Error (最頻発)**
```bash
即座実行手順:
1. .featureファイルの該当行確認
2. step定義ファイルの文字列完全一致確認
3. 日本語引用符→英語引用符変更試行
4. {string}パラメータ→リテラル文字列変更試行
5. 1step削除→動作確認→段階復旧
```

#### **Timeout Error**
```bash
即座実行手順:  
1. ヘッドレスモード無効化（ブラウザ表示）
2. 該当要素の目視確認
3. DevToolsでセレクタ動作確認
4. data-testid→テキストベース→CSS順で代替試行
5. waitForTimeout追加・タイミング調整
```

---

## 📈 **成功事例・ベストプラクティス**

### **第1シナリオ成功パターン**
```typescript
// ✅ 成功実装例
Then('「次へ」ボタンが表示される', async function () {
  await expect(this.page.locator('button:has-text("続ける")')).toBeVisible();
});

成功要因:
✅ シンプルなテキストベース検索
✅ data-testid依存回避
✅ 実装との完全同期
✅ 段階的追加・即座確認
```

### **推奨実装テンプレート**
```typescript
// テキスト内容確認用テンプレート
Then('「{具体的テキスト}」が表示される', async function () {
  await expect(this.page.locator('body')).toContainText('具体的テキスト');
});

// 要素存在確認用テンプレート  
Then('背景画像が表示される', async function () {
  await expect(this.page.locator('img, div[class*="bg-"]')).toBeVisible();
});

// data-testid確認用テンプレート（最小限使用）
Then('特定要素が表示される', async function () {
  await expect(this.page.locator('[data-testid="specific-element"]')).toBeVisible();
});
```

---

## 🎓 **学習・スキル向上推奨事項**

### **技術理解向上**
```markdown
優先学習項目:
□ Cucumber正規表現・パラメータマッチング仕様
□ Playwright要素選択・セレクタ最適化手法
□ BDD段階的実装・Red-Green-Refactorサイクル
□ 日本語BDD特有の制約・回避策

継続実践項目:
□ 1step追加→即座テスト習慣化
□ エラー解析・デバッグ手順標準化  
□ セレクタ戦略・パフォーマンス考慮向上
□ チーム協働・フィードバック効率化
```

---

**次スプリント担当者へのメッセージ**: このガイドの内容を実装前に必ず確認し、同様のミスを繰り返さないよう注意してください。特に「段階的実装・即座確認」の徹底と「data-testid使用判断基準」の遵守が重要です。疑問や課題が発生した場合は、このガイドを参照して迅速に解決してください。

---

**作成者**: テスト担当（Claude Code）  
**作成日**: 2025-08-20  
**対象**: 次スプリント担当者・開発チーム  
**次回更新**: 継続的改善・追加ミス発見時

#bdd-implementation #mistake-prevention #quality-assurance #team-guidance