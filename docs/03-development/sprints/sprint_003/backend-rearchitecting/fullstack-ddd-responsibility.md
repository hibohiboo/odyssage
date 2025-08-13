# フルスタックでの責務分担とDDD適用指針

> DDDアーキテクチャ議論を踏まえた、適切なドメイン駆動設計の適用範囲と責務分担の整理

## 📋 重要な前提認識

### **ユーザーの重要な指摘**
> 「私は、適切な場所ではDDDは採用すべきだと考えています。」

### **議論の核心**
- ❌ **誤解**: 「DDDを使う/使わない」の二択
- ✅ **正解**: 「**どこに、どのようにDDDを適用するか**」の境界設計

---

## 🎯 フルスタックでのDDD適用原則

### **原則1: ドメインの複雑性がある場所に適用**

#### **✅ DDD適用すべき領域**
```typescript
// フロントエンド - 複雑なビジネスロジック
class OptimisticSceneManager {
  // TRPGドメインの複雑性
  private validateSceneOrder(scenes: Scene[]): ValidationResult
  private handleConflictResolution(local: Scene[], server: Scene[]): Scene[]
  private applyBusinessRules(scene: Scene): ValidationErrors
}

// システム全体 - ドメインモデルの統一
interface TRPGDomain {
  Scenario: ScenarioAggregate;    // 創作・公開・権限の複雑なルール
  Session: SessionAggregate;      // 状態遷移・GM権限・参加者管理
  User: UserAggregate;            // ロール・権限・認証フロー
}
```

#### **⚠️ DDD過剰適用を避けるべき領域** 
```typescript
// バックエンドAPI - シンプルなCRUD
app.post('/api/scenarios', async (c) => {
  // ここに複雑なドメインロジックは不要
  const data = await validateInput(c.req.json());
  return await persistToDatabase(data);
});
```

### **原則2: システム境界での責務分離**

#### **フロントエンド責務 - ドメインロジック中心**
```typescript
// 🎯 DDD重点領域
class ScenarioCreationWorkflow {
  // ドメインサービス
  createScenario(authorId: string, input: ScenarioInput): ScenarioAggregate {
    const scenario = new Scenario(authorId, input);
    scenario.validateBusinessRules();      // ドメインルール
    scenario.setInitialVisibility();       // ビジネスロジック
    return scenario;
  }

  // 楽観的更新 - 複雑なドメイン知識
  handleOptimisticUpdate(scenario: Scenario, changes: Changes): UpdateResult {
    // 競合解決・状態整合性・UX考慮
  }
}
```

#### **バックエンド責務 - インフラストラクチャ中心**
```typescript
// 🔧 軽量なアプリケーションサービス
class ScenarioApplicationService {
  async persistScenario(scenarioData: ScenarioDTO): Promise<void> {
    // 最小限のバリデーション
    this.validator.validateDTO(scenarioData);
    
    // データ永続化
    await this.repository.save(scenarioData);
    
    // シンプルなビジネスルール（重複チェック程度）
    await this.checkDuplicateTitle(scenarioData.title);
  }
}
```

---

## 🏗️ Odyssage システムでのDDD適用戦略

### **現状分析: 既に適切な責務分担が実現**

#### **✅ フロントエンド - 適切なドメイン実装**
```typescript
// apps/frontend/src/entities/scenario/api/useOptimisticScenes.ts
// → 既にドメインロジックが適切に実装されている

export const useOptimisticScenes = (initialScenes: Scene[]) => {
  // ドメイン知識: シーンの順序管理
  const optimisticCreate = useCallback((sceneData) => {
    const newScene: Scene = { ...sceneData, id: tempId, scenarioId };
    setCurrent(prev => 
      [...prev, newScene].sort((a, b) => a.order - b.order)  // ビジネスルール
    );
    setHasUnsavedChanges(true);  // 状態管理
  }, [scenarioId]);
  
  // ドメインサービス: 競合解決
  const handleServerResponse = useCallback((serverScenes: Scene[]) => {
    // 複雑な楽観的更新ロジック
  }, []);
};
```

#### **✅ バックエンド - 適切なシンプル設計**
```typescript
// apps/backend/src/route/session.ts
// → データ永続化に特化した適切な実装

.post('/', vValidator('json', sessionRequestSchema), async (c) => {
  const sessionId = generateUUID();
  await createSession(c.env.NEON_CONNECTION_STRING, {
    id: sessionId,
    gmId: json.gmId,
    scenarioId: json.scenarioId,
    title: json.title,
    status: '準備中',  // シンプルなデフォルト値
  });
  return c.json({ id: sessionId }, 201);
});
```

### **改善すべきDDD適用領域**

#### **🎯 Phase 1: ドメインモデルの明示的定義**
```typescript
// 新規作成: packages/domain/
export interface TRPGDomain {
  // 集約ルート
  Scenario: {
    id: ScenarioId;
    title: ScenarioTitle;        // 値オブジェクト
    visibility: Visibility;       // 列挙型
    author: AuthorId;
    
    // ドメインメソッド
    publish(): ValidationResult;
    validateTitle(): boolean;
    canBeEditedBy(userId: UserId): boolean;
  };
  
  Session: {
    id: SessionId;
    status: SessionStatus;       // '準備中' | '進行中' | '完了'
    gm: GameMasterId;
    scenario: ScenarioId;
    
    // ビジネスルール
    canStart(): boolean;
    addPlayer(playerId: PlayerId): ValidationResult;
    transitionTo(newStatus: SessionStatus): ValidationResult;
  };
}
```

#### **🎯 Phase 2: フロントエンドドメインサービス強化**
```typescript
// 強化: apps/frontend/src/domain/services/
export class ScenarioWorkflowService {
  // ドメインサービス
  createScenarioWorkflow(input: CreateScenarioInput): ScenarioWorkflowResult {
    const scenario = Scenario.create(input);
    const validationResult = this.validateBusinessRules(scenario);
    const visibilityPolicy = this.determineInitialVisibility(scenario);
    
    return new ScenarioWorkflowResult(scenario, validationResult, visibilityPolicy);
  }
  
  // 複雑なドメインロジック
  handleOptimisticConflict(
    localChanges: ScenarioChange[], 
    serverState: Scenario
  ): ConflictResolution {
    // ビジネスルールに基づく競合解決
  }
}
```

#### **🎯 Phase 3: バックエンドでの最小限ドメイン適用**
```typescript
// 新規: apps/backend/src/domain/
export class ScenarioValidator {
  // シンプルなドメインルール
  validateForPersistence(scenario: ScenarioDTO): ValidationResult {
    return ValidationResult.combine([
      this.validateTitleUniqueness(scenario.title),
      this.validateAuthorPermissions(scenario.authorId),
      this.validateContentPolicy(scenario.content),
    ]);
  }
}

// 既存強化: apps/backend/src/route/scenario.ts
.post('/', async (c) => {
  const input = await c.req.json();
  
  // 最小限のドメインロジック適用
  const validationResult = scenarioValidator.validateForPersistence(input);
  if (!validationResult.isValid) {
    return c.json({ errors: validationResult.errors }, 400);
  }
  
  await persistScenario(input);
  return c.json({ id: input.id }, 201);
});
```

---

## 📊 適用原則とガイドライン

### **✅ DDD適用の判断基準**

| 領域 | 複雑性 | DDD適用度 | 適用内容 |
|------|--------|-----------|----------|
| **フロントエンド状態管理** | 高 | ★★★ | 完全なドメインモデル・サービス |
| **フロントエンドUI** | 中 | ★★☆ | ドメインオブジェクト・値オブジェクト |
| **バックエンドAPI** | 低 | ★☆☆ | 最小限のバリデーション・ルール |
| **データベース層** | 低 | ☆☆☆ | DDD不要・永続化に特化 |

### **❌ 過剰適用を避けるべきパターン**

#### **×× バックエンドでの過度なレイヤー化**
```typescript
// ❌ 過剰 - シンプルなCRUDに不要
class ScenarioRepositoryImpl implements ScenarioRepository {
  async save(scenario: ScenarioAggregate): Promise<void> {
    // 単純な保存処理に複雑な抽象化は不要
  }
}

class ScenarioDomainService {
  // バックエンドに複雑なドメインサービスは不適切
}
```

#### **✅ 適切なレベル**
```typescript
// ✅ 適切 - 必要最小限
const scenarioValidator = {
  validateUniqueness: (title: string) => boolean,
  validatePermissions: (authorId: string) => boolean,
};
```

---

## 🎯 実装優先順位

### **Phase 1: ドメインモデル定義（1週間）**
- TRPGドメインオブジェクトの明示的定義
- 値オブジェクト・列挙型の整理
- ビジネスルールの文書化

### **Phase 2: フロントエンドドメイン強化（2-3週間）** 
- 複雑なドメインロジックのサービス化
- 楽観的更新の戦略パターン化
- 状態管理のドメイン境界明確化

### **Phase 3: バックエンド最適化（1週間）**
- 最小限のビジネスルール実装
- エラーハンドリング統一
- バリデーション強化

---

## 💡 重要な結論

### **DDDは「使う/使わない」ではなく「どこに適用するか」**

1. **フロントエンド**: 複雑なドメインロジック → **フルDDD適用**
2. **バックエンド**: データ永続化 → **最小限DDD適用**
3. **システム全体**: ドメインモデル統一 → **共通語彙・境界明確化**

### **現在のOdyssageの設計は既に適切**
- フロントエンドに複雑性を配置
- バックエンドはシンプルに保つ
- 改善の余地はあるが、根本的な設計変更は不要

### **今後の改善方針**
- ドメイン知識の明示的定義
- フロントエンドドメインサービスの強化
- バックエンドでの最小限ドメインルール適用

---

## 🏷️ メタデータ

**作成日**: 2025-08-11  
**関連Issue**: #111（バックエンドリアーキテクティング）  
**関連文書**: [[ddd-architecture-discussion.md]]  
**ステータス**: DDD適用指針確立  
**次アクション**: Phase 1実装検討

#ddd #architecture #fullstack #domain-driven-design #responsibility-separation