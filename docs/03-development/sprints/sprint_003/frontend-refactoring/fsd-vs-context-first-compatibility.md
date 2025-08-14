# FSD vs Context-First Architecture の相性検討

## 📋 問題の整理

### **ユーザーからの重要な指摘**
> 「FSDのディレクトリ構造ではなくなっている気がしますが、Context Firstとは相性が悪いでしょうか」

### **提案した構造の問題点**
```
❌ 提案した構造（FSDから逸脱）
src/
├── contexts/
│   └── player/                    # ユーザー文脈別
│       ├── scenarios/
│       ├── gameplay/
│       └── history/
```

### **本来のFSD構造**
```
✅ Feature-Sliced Design
src/
├── app/         # アプリケーション設定
├── pages/       # ページ
├── widgets/     # 複合UIコンポーネント
├── features/    # ビジネス機能
├── entities/    # ドメインエンティティ
└── shared/      # 共通ライブラリ
```

---

## 🤔 FSD と Context-First の関係性分析

### **問題：構造の衝突**

#### **FSD の設計思想**
```typescript
interface FSDPrinciples {
  layered_architecture: {
    principle: "抽象度による階層分離";
    layers: ["app", "pages", "widgets", "features", "entities", "shared"];
    dependency_rule: "上位層のみが下位層に依存";
  };
  
  business_logic_organization: {
    principle: "機能単位での縦割り組織化";
    structure: "features/{feature-name}/{segment}";
    segments: ["api", "model", "ui"];
  };
}
```

#### **Context-First の設計思想**
```typescript
interface ContextFirstPrinciples {
  user_context_separation: {
    principle: "ユーザー文脈による境界設定";
    contexts: ["author", "gm", "player"];
    isolation: "文脈間の完全分離";
  };
  
  role_based_organization: {
    principle: "ロール別の専用実装";
    structure: "contexts/{role}/{functionality}";
  };
}
```

### **根本的な相違点**
```markdown
## FSD: 抽象度による階層
- app > pages > widgets > features > entities > shared
- 機能横断的な再利用を重視
- アーキテクチャの統一性を優先

## Context-First: ユーザー文脈による分離  
- author / gm / player の完全分離
- 文脈特化の実装を重視
- ユーザー体験の最適化を優先

→ 根本的に異なる組織化原理
```

---

## 💡 解決策：FSD準拠 Context-First ハイブリッド

### **提案：FSD構造内でのContext分離**

#### **features層でのContext分離**
```
src/
├── app/
├── pages/
│   ├── player/              # プレイヤー専用ページ
│   │   ├── ScenarioListPage.tsx
│   │   ├── GamePlayPage.tsx
│   │   └── HistoryPage.tsx
│   ├── author/              # 作成者専用ページ（将来）
│   └── gm/                  # GM専用ページ（将来）
├── widgets/
│   ├── player/              # プレイヤー専用ウィジェット
│   │   ├── PlayerNavigation.tsx
│   │   └── PlayerDashboard.tsx
│   └── shared/              # 共通ウィジェット
├── features/
│   ├── player-scenario-browsing/    # プレイヤーシナリオ閲覧
│   │   ├── api/
│   │   ├── model/
│   │   └── ui/
│   ├── player-gameplay/             # プレイヤーゲームプレイ
│   │   ├── api/
│   │   ├── model/
│   │   └── ui/
│   ├── player-history/              # プレイヤー履歴管理
│   │   ├── api/
│   │   ├── model/
│   │   └── ui/
│   └── scenario-management/         # 将来：作成者機能
├── entities/
│   ├── scenario/            # シナリオエンティティ（共通）
│   ├── session/             # セッションエンティティ（共通）
│   └── user/                # ユーザーエンティティ（共通）
└── shared/
    ├── ui/                  # 共通UIコンポーネント
    ├── api/                 # 共通API
    └── lib/                 # 共通ライブラリ
```

### **この構造の利点**

#### **✅ FSD原則の遵守**
```markdown
1. 階層の依存関係維持:
   pages → widgets → features → entities → shared

2. セグメント分離:
   各feature内で api/model/ui の分離

3. 再利用性確保:
   entities/shared での共通化
```

#### **✅ Context-First の実現**
```markdown
1. プレイヤー文脈の分離:
   player-* features でプレイヤー専用実装

2. 将来拡張性:
   author-* gm-* features の段階的追加

3. 境界の明確化:
   pages/player/* での明確なルート分離
```

---

## 🏗️ 具体的な実装例

### **プレイヤーシナリオ閲覧機能**
```typescript
// features/player-scenario-browsing/
├── api/
│   └── playerScenarioApi.ts
├── model/
│   ├── usePlayerScenarios.ts
│   └── playerScenarioStore.ts
└── ui/
    ├── PlayerScenarioBrowser.tsx
    ├── PlayerScenarioCard.tsx
    └── PlayerScenarioFilter.tsx

// features/player-scenario-browsing/api/playerScenarioApi.ts
export const playerScenarioApi = {
  getPublicScenarios: () => apiClient.get('/api/scenarios/public'),
  getScenarioDetail: (id: string) => apiClient.get(`/api/scenarios/${id}`),
  // プレイヤー文脈での利用に特化したAPI
};

// features/player-scenario-browsing/model/usePlayerScenarios.ts
export function usePlayerScenarios() {
  // プレイヤー文脈でのシナリオ一覧ロジック
  return useSWR('/player/scenarios', playerScenarioApi.getPublicScenarios);
}

// features/player-scenario-browsing/ui/PlayerScenarioBrowser.tsx
export function PlayerScenarioBrowser() {
  const { scenarios } = usePlayerScenarios();
  // プレイヤー向けの表示・フィルタリングUI
}
```

### **ページレベルでの統合**
```typescript
// pages/player/ScenarioListPage.tsx
import { PlayerScenarioBrowser } from '@/features/player-scenario-browsing';
import { PlayerNavigation } from '@/widgets/player';

export function ScenarioListPage() {
  return (
    <div>
      <PlayerNavigation />
      <PlayerScenarioBrowser />
    </div>
  );
}
```

### **ルーティング設計**
```typescript
// app/router/playerRoutes.tsx
const playerRoutes = {
  path: '/player',
  children: [
    {
      path: 'scenarios',
      element: <ScenarioListPage />,
    },
    {
      path: 'scenarios/:id/play',
      element: <GamePlayPage />,
    },
    {
      path: 'history',
      element: <HistoryPage />,
    },
  ],
};
```

---

## 🔄 段階的な拡張戦略

### **Phase 1: Player Features（現在）**
```
features/
├── player-scenario-browsing/
├── player-gameplay/
└── player-history/
```

### **Phase 2: Author Features（将来）**
```
features/
├── player-scenario-browsing/
├── player-gameplay/
├── player-history/
├── author-scenario-creation/     # 新規追加
├── author-scenario-editing/      # 新規追加
└── author-publishing/            # 新規追加
```

### **Phase 3: GM Features（将来）**
```
features/
├── (all previous features...)
├── gm-session-management/        # 新規追加
├── gm-player-management/         # 新規追加
└── gm-scenario-customization/    # 新規追加
```

### **段階的拡張での利点**
```markdown
✅ FSD構造維持:
各Phaseで同じfeatures構造を使用

✅ Context分離継続:
*-player-* *-author-* *-gm-* での明確な分離

✅ 再利用性確保:
entities/shared での共通ドメインロジック活用

✅ 技術負債回避:
未使用featureが明確に分離される
```

---

## 📊 比較：3つのアプローチ

### **アプローチA：純粋FSD**
| 項目 | 評価 | 理由 |
|------|------|------|
| FSD準拠度 | ★★★★★ | 完全にFSD原則に従った構造 |
| Context分離 | ★★☆☆☆ | 文脈境界が曖昧 |
| 実装しやすさ | ★★★☆☆ | 複数文脈での複雑性 |
| 将来拡張性 | ★★★★☆ | FSDの恩恵を受けやすい |

### **アプローチB：純粋Context-First**
| 項目 | 評価 | 理由 |
|------|------|------|
| FSD準拠度 | ★★☆☆☆ | FSD構造から逸脱 |
| Context分離 | ★★★★★ | 完全な文脈分離 |
| 実装しやすさ | ★★★★★ | 文脈特化で実装が簡単 |
| 将来拡張性 | ★★★☆☆ | 横断的機能で課題 |

### **アプローチC：FSD準拠Context-First（推奨）**
| 項目 | 評価 | 理由 |
|------|------|------|
| FSD準拠度 | ★★★★☆ | FSD構造を維持しつつ文脈対応 |
| Context分離 | ★★★★☆ | feature名での明確な分離 |
| 実装しやすさ | ★★★★☆ | バランスの良い実装体験 |
| 将来拡張性 | ★★★★★ | 両方の利点を享受 |

---

## 🎯 推奨実装戦略

### **FSD準拠Context-Firstアプローチ**

#### **なぜこの選択が最適か**
```markdown
✅ アーキテクチャ学習価値:
FSDの正しい実践 + Context-Firstの革新的適用

✅ 技術負債回避:
feature単位での明確な境界 + 段階的拡張

✅ 保守性・拡張性:
FSDの恩恵 + ユーザー文脈の明確化

✅ 実装効率:
文脈特化の高速開発 + 再利用性の確保
```

#### **具体的な実装手順**
```markdown
Week 1: 基盤構築
- FSD構造のディレクトリ作成
- player-scenario-browsing feature実装
- pages/player での統合

Week 2: ゲームプレイ機能
- player-gameplay feature実装
- entities/scenario でのドメインロジック

Week 3: 履歴機能
- player-history feature実装
- shared/ui での汎用コンポーネント活用

Week 4: 完成・振り返り
- FSD + Context-First 実践の技術ブログ化
```

#### **技術ブログテーマ**
```markdown
1. "FSDとContext-Firstの融合：プレイヤー文脈特化アーキテクチャ"
2. "feature命名によるユーザー文脈分離の実践"
3. "段階的Context拡張：player → author → gm"
4. "FSD準拠でありながらContext-Firstを実現する設計判断"
```

---

## 💭 重要な判断ポイント

### **アーキテクチャ学習としての価値**

**FSD準拠Context-Firstアプローチは、現代的なフロントエンドアーキテクチャの実践として非常に価値が高いです。**

- **FSDの正しい理解・実践**
- **革新的なContext-First適用**  
- **両方の利点を活かした設計判断**

### **実装効率との両立**

この方法なら：
- プレイヤー機能を `player-*` features で集中実装
- 既存のAuthor/GM実装との衝突回避
- 将来の段階的拡張が自然に実現

**このFSD準拠Context-Firstアプローチについてどう思われますか？**

純粋なContext-Firstと比較して、実装効率や学習価値の観点でいかがでしょうか？

---

## 🏷️ メタデータ

**作成日**: 2025-08-14  
**検討対象**: FSD vs Context-First Architecture の相性・融合  
**推奨解決策**: FSD準拠Context-Firstハイブリッドアプローチ  
**重要な価値**: アーキテクチャ学習・実装効率・将来拡張性の両立

#fsd #context-first #architecture-compatibility #frontend-design