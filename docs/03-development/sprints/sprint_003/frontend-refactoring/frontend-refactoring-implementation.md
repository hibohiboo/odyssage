# フロントエンドリファクタリング計画

## 現状分析

### コード量と構造
- **総ファイル数**: 81ファイル（.ts/.tsx）
- **現在の設計**: DDD + FSD を意図したが中途半端な状態
- **主な技術スタック**: React + Redux Toolkit + React Router + SWR

### 問題点とコード負債

#### 1. 不明確なレイヤー分離
- **現在**: `entities`, `page`, `shared` の混在
- **問題**: 
  - DDDのエンティティとFSDのエンティティが混同されている
  - `page`層がFSDの`pages`として機能していない
  - `shared`が雑多な機能の集約場所になっている

#### 2. インポート構造の複雑化
- **パス数**: `@odyssage/frontend`を使った64箇所のインポート
- **問題**: 
  - 長いインポートパス（`@odyssage/frontend/shared/lib/store`）
  - レイヤー違反の可能性
  - 循環参照のリスク

#### 3. 責務の混在
- **CreatePage**: 単なる再エクスポート（`export const CreatePage = CreateScenario;`）
- **CreateScenario**: APIコール、GraphDB操作、ビジネスロジックが混在
- **Layout**: プレゼンテーション層で複数の責務を持つ

#### 4. 状態管理の二重管理
- **Redux**: グローバル状態管理
- **SWR**: サーバー状態管理
- **useState**: コンポーネント状態管理
- **問題**: 状態の責任範囲が不明確

## リファクタリング方針

### 1. アーキテクチャの明確化
**目標**: Clean Architecture + FSD の組み合わせ

```
src/
├── app/           # アプリケーション設定（Router, Store）
├── pages/         # ページコンポーネント（ルート単位）
├── widgets/       # 複合的なUIコンポーネント
├── features/      # ビジネス機能単位
├── entities/      # ビジネスエンティティ
└── shared/        # 共通ライブラリ・ユーティリティ
```

### 2. 段階的リファクタリング戦略

#### Phase 1: Import構造の整理（優先度：高）
1. **パスエイリアスの見直し**
   - `@odyssage/frontend` → `~/` または `@/` 
   - レイヤー別のエイリアス導入

2. **レイヤー間依存関係の明確化**
   - `shared` → `entities` → `features` → `widgets` → `pages` → `app`
   - 下位層から上位層への依存のみ許可

#### Phase 2: 責務分離の実施（優先度：高）
1. **APIレイヤーの分離**
   ```typescript
   // Before: entities/scenario/components/CreateScenario.tsx
   const saveToGraphDB = async (id: string, title: string, overview: string) => {
     // API呼び出しロジック
   }

   // After: entities/scenario/api/scenarioRepository.ts
   export class ScenarioRepository {
     async saveToGraphDB(scenario: ScenarioEntity): Promise<void>
   }
   ```

2. **ビジネスロジックの分離**
   ```typescript
   // features/scenario/create/model/createScenarioService.ts
   export class CreateScenarioService {
     constructor(
       private repository: ScenarioRepository,
       private validator: ScenarioValidator
     ) {}
   }
   ```

#### Phase 3: 状態管理の統一（優先度：中）
1. **状態管理責任の明確化**
   - **Redux**: グローバルなアプリケーション状態（認証、設定）
   - **SWR**: サーバーデータキャッシュ
   - **useState**: 純粋なUI状態

2. **カスタムフックの統一**
   ```typescript
   // features/scenario/create/hooks/useCreateScenario.ts
   export function useCreateScenario() {
     const repository = useScenarioRepository();
     const service = useCreateScenarioService(repository);
     return service;
   }
   ```

#### Phase 4: コンポーネント構造の整理（優先度：中）
1. **プレゼンテーション/コンテナパターンの適用**
   ```typescript
   // widgets/scenario/ScenarioEditor/ui/ScenarioEditor.tsx (Presentation)
   // features/scenario/create/ui/CreateScenarioForm.tsx (Container)
   ```

2. **再利用可能コンポーネントの`shared/ui`への移動**

### 3. 実装ガイドライン

#### インポートルール
```typescript
// ❌ 悪い例
import { apiClient } from '@odyssage/frontend/shared/api/client';

// ✅ 良い例
import { apiClient } from '~/shared/api';
```

#### ファイル命名規則
```
features/
└── scenario/
    ├── create/
    │   ├── api/
    │   ├── model/
    │   ├── ui/
    │   └── index.ts
    └── edit/
```

#### レイヤー間通信
```typescript
// entities層: ビジネスロジックのみ
export class ScenarioEntity {
  constructor(
    public id: string,
    public title: string,
    public overview: string
  ) {}
  
  validate(): ValidationResult {
    // バリデーションロジック
  }
}

// features層: ユースケース実装
export function useCreateScenario() {
  const mutation = useScenarioMutation();
  
  return {
    createScenario: (data: ScenarioInput) => {
      const entity = new ScenarioEntity(data);
      const validation = entity.validate();
      if (!validation.isValid) return validation;
      
      return mutation.mutate(entity);
    }
  };
}
```

### 4. 移行計画

#### Week 1-2: 基盤整備
- [ ] パスエイリアスの設定・適用
- [ ] ESLintルールの追加（レイヤー間依存チェック）
- [ ] ディレクトリ構造の作成

#### Week 3-4: 段階的移行
- [ ] `shared`レイヤーの整理
- [ ] `entities`レイヤーの再構築
- [ ] APIレイヤーの分離

#### Week 5-6: 機能層の再構築
- [ ] `features`レイヤーの実装
- [ ] 既存コンポーネントの移行
- [ ] カスタムフックの整理

#### Week 7-8: 仕上げ
- [ ] `widgets`・`pages`レイヤーの実装
- [ ] テストの追加・修正
- [ ] ドキュメント更新

### 5. 品質保証

#### 自動化チェック
```json
// .eslintrc.js
{
  "rules": {
    "@typescript-eslint/no-restricted-imports": ["error", {
      "patterns": [
        "../../*", // 相対パス2階層以上禁止
        "*/entities/*/api/*" // entities層のAPI直接アクセス禁止
      ]
    }]
  }
}
```

#### 移行チェックリスト
- [ ] 各レイヤーの責務が明確か
- [ ] インポート構造が規約に従っているか
- [ ] 既存機能が正常に動作するか
- [ ] テストカバレッジが維持されているか
- [ ] バンドルサイズが増大していないか

## 期待効果

### 開発効率の向上
- **インポート時間短縮**: 64箇所の長いパス → 短縮されたエイリアス
- **コード理解の容易化**: 明確な責務分離により新規参加者の学習コスト削減
- **保守性向上**: レイヤー間の依存関係が明確化

### コード品質の向上
- **テスタビリティ**: 責務分離によるユニットテスト作成容易化
- **再利用性**: 明確な境界により他機能での再利用が容易
- **拡張性**: 新機能追加時の影響範囲の限定

### 技術負債の解消
- **循環参照の解消**: 明確なレイヤー構造により循環参照を防止
- **状態管理の整理**: 責務の明確化により状態管理の複雑さを解消
- **コードの重複削減**: 共通化により重複コードを削減