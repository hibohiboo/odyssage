# ルーティング設計確認依頼書

## 📋 基本情報

**依頼者**: プロジェクトリーダー  
**対象者**: 設計担当  
**作成日**: 2025年8月18日  
**緊急度**: 高（Phase 2完了・動作確認に必要）  
**課題**: PlaySessionContainerへのアクセスパス不明

---

## 🚨 **緊急確認事項**

### **実装担当からのフィードバック**
Phase 2実装完了報告にて以下の課題が判明：

```markdown
❌ 現在の制約
1. ルーティング未実装: PlaySessionContainerへの直接アクセスパス不存在
2. 動作確認制限: Storybook または 暫定ルーティング追加が必要
```

### **実装担当の提案**
```markdown
Phase 3 優先実装候補
1. ルーティング統合: `/player/session/:sessionId/play/:sceneId` パス設計
2. 既存フロー統合: SessionListPage → PlaySessionContainer 遷移
3. 動作確認環境: Storybook統合またはデモページ作成
```

---

## 🎯 **設計担当への確認依頼事項**

### **Priority 1: ルーティング設計方針の確認**

#### 1. **Player文脈画面のルーティング設計**
```typescript
// 想定されるルーティング構造
/player/
├── sessions/                    # SessionListPage
├── session/:sessionId/          # SessionDetailPage  
├── session/:sessionId/play      # PlaySessionContainer ← 未定義？
└── session/:sessionId/play/:sceneId  # 特定Scene開始？
```

**確認事項**:
- ✅ **Player文脈のルーティング全体設計は存在するか？**
- ✅ **PlaySessionContainerへのアクセスパスは定義済みか？**
- ✅ **SessionDetailPage → PlaySessionContainer遷移フローは設計済みか？**

#### 2. **MVP制約下でのルーティング範囲**
```markdown
確認項目:
✅ MVP範囲内で実装すべきルーティングパスは？
✅ Phase 2完了確認に必要な最小限のルーティングは？
✅ 複雑なルーティング機能（パラメータバリデーション等）は除外対象か？
```

### **Priority 2: 既存画面との統合設計**

#### 1. **SessionListPage → PlaySessionContainer統合**
```typescript
// 想定される遷移フロー
SessionListPage 
  → SessionCard.onClick() 
    → navigate('/player/session/{sessionId}/play') 
      → PlaySessionContainer
```

**確認事項**:
- ✅ **この遷移フローは設計済みか？**
- ✅ **SessionCardのonClick実装は設計されているか？**
- ✅ **必要なパラメータ（sessionId, startingSceneId）の渡し方は？**

#### 2. **既存画面への影響**
```markdown
確認項目:
✅ SessionListPage修正範囲は？
✅ SessionDetailPageは必要か？それとも直接Play画面遷移か？
✅ 他の既存画面（SessionCard, etc）への影響は？
```

---

## 🔧 **技術的確認事項**

### **React Router v7統合**
```typescript
// 想定される実装パターン
// Route定義
<Route path="/player/session/:sessionId/play" element={<PlaySessionContainer />} />

// 遷移実装
const navigate = useNavigate();
const startPlay = (sessionId: string) => {
  navigate(`/player/session/${sessionId}/play`);
};
```

**確認事項**:
- ✅ **React Router v7のルート定義設計は存在するか？**
- ✅ **パラメータ取得（useParams）の設計は？**
- ✅ **ルーティング設定ファイルの場所・構造は？**

### **MVP制約との整合性**
```markdown
確認項目:
✅ ルーティング実装はMVP制約範囲内か？
✅ 複雑なルーティング機能（認証、ガード等）は除外対象か？
✅ シンプルなパス定義・パラメータ取得のみで十分か？
```

---

## ⏰ **緊急性の理由**

### **Phase 2完了確認の阻害**
```markdown
現状:
❌ PlaySessionContainer実装完了
❌ 動作確認手段がない（アクセスパス不明）
❌ Phase 2完了確認ができない状況

必要:
✅ 最小限のルーティング設定
✅ PlaySessionContainerへのアクセス手段
✅ 動作確認・品質確認の実施
```

### **Phase 3への影響**
```markdown
Phase 3計画:
✅ Unit・Integration・Component・E2Eテスト実行
❌ ルーティング不明によりE2Eテスト実行困難
❌ 実際のユーザーシナリオ確認困難

解決必要:
✅ ルーティング設計明確化
✅ E2Eテスト対象パス定義
✅ BDD動作確認環境整備
```

---

## 🎯 **期待する回答**

### **即座回答希望事項**
1. **ルーティング設計の存在確認**
   - Player文脈ルーティング全体設計の有無
   - PlaySessionContainerアクセスパス定義の有無

2. **MVP範囲内ルーティング仕様**
   - 実装すべき最小限のルーティングパス
   - 除外すべき複雑ルーティング機能

3. **緊急対応方針**
   - Phase 2動作確認のための暫定対応
   - Phase 3テスト実行のための最小限実装

### **詳細設計希望事項**
1. **具体的ルーティング定義**
   - パス構造・パラメータ仕様
   - Route定義・Component配置

2. **既存画面統合設計**
   - SessionListPage修正範囲
   - 遷移フロー・パラメータ受け渡し

3. **Phase 3以降の拡張方針**
   - 段階的ルーティング拡張計画
   - 将来機能への拡張性考慮

---

## 🤝 **協働方針**

### **設計担当からの期待支援**
- ✅ **ルーティング設計の明確化・文書化**
- ✅ **MVP制約遵守範囲の明確化**
- ✅ **実装担当への技術仕様提供**

### **リーダーからの支援**
- ✅ **緊急対応の優先度調整**
- ✅ **Phase 2完了確認の延期判断**
- ✅ **Phase 3計画への影響調整**

### **実装担当との協働**
- ✅ **暫定対応の技術実装**
- ✅ **動作確認環境の確保**
- ✅ **Phase 3テスト準備の継続**

---

## 📞 **緊急連絡・相談体制**

### **即座対応が必要な判断**
- **ルーティング設計が未定義の場合**: 緊急設計・暫定対応の要否
- **MVP制約超過の場合**: 機能削減・代替手段の検討
- **Phase 2完了判断**: 動作確認なしでの完了承認の可否

### **調整が必要な事項**
- **Phase 3計画への影響**: テスト実行方法・BDD動作確認手段
- **Sprint 4完遂**: ルーティング実装による工数・スケジュール影響
- **品質保証**: 動作確認手段による品質確認レベル調整

---

**設計担当の専門知識とご判断により、この重要課題の解決をお願いいたします。**

**Phase 2完了確認・Phase 3成功・Sprint 4完遂に向けて、緊急対応をお願いいたします。**

#routing-design #urgent-inquiry #phase2-completion #mvp-constraints #team-collaboration